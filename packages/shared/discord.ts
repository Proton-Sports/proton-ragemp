export type DiscordUser = {
    id: string;
    username: string;
    avatar: string;
    global_name: string;
};

export type DiscordOAuth2Token = {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
};
