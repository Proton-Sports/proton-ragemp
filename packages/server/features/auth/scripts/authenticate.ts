import type { Runtime } from '@kernel/runtime';
import { createScript } from '@kernel/script';
import { attempt } from '@repo/shared';
import { type DiscordOAuth2Token, type DiscordUser } from '@repo/shared/discord';

const playerDiscordTokens = new Map<PlayerMp, DiscordOAuth2Token>();

export default createScript({
    name: 'authenticate',
    fn: ({ messenger, fetch, logger, env }) => {
        mp.events.add('playerJoin', (player) => {
            messenger.publish(player, 'authentication.mount');
        });

        messenger.on('authentication.requestOAuth2', (player) => {
            messenger.publish(player, 'authentication.requestOAuth2', env.DISCORD_OAUTH2_CLIENT_ID);
        });

        messenger.on('authentication.code', async (player, code: string) => {
            const tokenAttempt = await exchangeCode({ fetch, env })(code);

            if (!tokenAttempt.ok) {
                messenger.publish(player, 'authentication.error', tokenAttempt.error);
                return;
            }

            const jsonAttempt = await attempt.promise(() => tokenAttempt.data.json() as Promise<DiscordOAuth2Token>)();
            if (!jsonAttempt.ok) {
                messenger.publish(player, 'authentication.error', 'Failed to parse token response');
                return;
            }

            const discordUserAttempt = await getDiscordProfile(fetch)(jsonAttempt.data.access_token);
            if (!discordUserAttempt.ok) {
                messenger.publish(player, 'authentication.error', 'Failed to get user profile');
                return;
            }

            // Check if user is banned
            const isBanned = await checkIfBanned(discordUserAttempt.data.id);
            if (isBanned) {
                player.kick('You were banned');
                return;
            }

            // Store token and send information to client
            playerDiscordTokens.set(player, jsonAttempt.data);

            // Get avatar URL and send login information
            const avatarUrl = discordUserAttempt.data.avatar
                ? `https://cdn.discordapp.com/avatars/${discordUserAttempt.data.id}/${discordUserAttempt.data.avatar}.png`
                : 'https://cdn.discordapp.com/embed/avatars/0.png';

            messenger.publish(player, 'authentication.profile', avatarUrl, discordUserAttempt.data.username);
        });

        // Handle player disconnection - clean up resources
        mp.events.add('playerQuit', (player) => {
            playerDiscordTokens.delete(player);
        });

        // Handle OAuth token exchange from client
        messenger.on('authentication.token.exchange', async (player, code: string) => {});

        // Handle login request from client
        messenger.on('authentication.login', async (player) => {
            const token = playerDiscordTokens.get(player);
            if (!token) {
                messenger.publish(player, 'authentication.error', 'Not authenticated with Discord');
                return;
            }

            // Get profile again to ensure token is still valid
            const profileAttempt = await getDiscordProfile(fetch)(token.access_token);
            if (!profileAttempt.ok) {
                messenger.publish(player, 'authentication.error', 'Token expired');
                return;
            }

            // Check if user is registered, register if not
            const isRegistered = await isUserRegistered(profileAttempt.data.id);
            if (!isRegistered) {
                await registerUser(profileAttempt.data, player.name);
            }

            // Login user and get user ID
            const userId = await loginUser(profileAttempt.data.id, player.ip);
            if (userId === 0) {
                player.kick('There was a mistake while logging in!');
                return;
            }

            // Set player data
            player.protonId = userId;
            player.role = await getUserRole(userId);

            // Notify client of successful login
            messenger.publish(player, 'authentication.login');

            // Emit legacy event
            mp.events.call('auth.firstSignIn', player);
        });

        // Handle logout
        messenger.on('authentication.logout', (player) => {
            playerDiscordTokens.delete(player);
            player.kick('Logged out');
        });

        // Handle resource/server stop
        mp.events.add('resourceStop', () => {
            playerDiscordTokens.clear();
        });
    },
});

// Helper function to exchange OAuth code for token
const exchangeCode =
    ({ fetch, env }: Pick<Runtime, 'fetch' | 'env'>) =>
    async (code: string) => {
        const searchParams = new URLSearchParams();
        searchParams.set('grant_type', 'authorization_code');
        searchParams.set('code', code);
        searchParams.set('redirect_uri', 'http://localhost:5173');
        searchParams.set('client_id', env.DISCORD_OAUTH2_CLIENT_ID);
        searchParams.set('client_secret', env.DISCORD_OAUTH2_CLIENT_SECRET);

        const exchangeAttempt = await attempt.promise(() =>
            fetch('https://discord.com/api/v10/oauth2/token', {
                method: 'post',
                body: searchParams.toString(),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }),
        )(() => 'Failed to fetch Discord token exchange response');

        if (!exchangeAttempt.ok) {
            return exchangeAttempt;
        }

        if (!exchangeAttempt.data.ok) {
            console.log(await exchangeAttempt.data.json())
            return attempt.fail(`Discord API error: ${exchangeAttempt.data.status}`);
        }

        return exchangeAttempt;
    };

// Get Discord user profile
const getDiscordProfile = (fetch: Runtime['fetch']) => async (accessToken: string) => {
    const getAttempt = await attempt.promise(() =>
        fetch('https://discord.com/api/v10/users/@me', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }),
    )(() => 'Failed to fetch Discord profile');

    if (!getAttempt.ok) {
        return getAttempt;
    }

    if (!getAttempt.data.ok) {
        return attempt.fail(`Discord API error: ${getAttempt.data.status}`);
    }
    return attempt.promise(() => getAttempt.data.json() as Promise<DiscordUser>)(
        () => 'Failed to parse Discord profile response',
    );
};

// Check if user is banned
// In a real implementation, this would check a database
async function checkIfBanned(discordId: string): Promise<boolean> {
    // TODO: Implement database check for banned users
    return false;
}

// Check if user is registered
// In a real implementation, this would check a database
async function isUserRegistered(discordId: string): Promise<boolean> {
    // TODO: Implement database check
    return false;
}

// Register a new user
// In a real implementation, this would add the user to a database
async function registerUser(profile: DiscordUser, socialClubName: string): Promise<void> {
    // TODO: Implement user registration in database
}

// Login a user and return their user ID
// In a real implementation, this would update login timestamp and return user ID from database
async function loginUser(discordId: string, ipAddress: string): Promise<number> {
    // TODO: Implement proper login in database
    // For now, return a mock ID based on the Discord ID
    return parseInt(discordId.substring(0, 8), 16) || 0;
}

// Get user role
// In a real implementation, this would fetch role from database
async function getUserRole(userId: number): Promise<string> {
    // TODO: Implement database lookup for user role
    return 'user';
}
