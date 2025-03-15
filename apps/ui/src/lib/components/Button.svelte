<script lang="ts">
    import type { HTMLButtonAttributes } from 'svelte/elements';

    interface Props extends HTMLButtonAttributes {
        variant?: 'base' | 'primary' | 'subtle';
    }

    const { variant = 'base', children, class: cls, ...props }: Props = $props();
</script>

<button data-variant={variant} class={['c-button', cls]} {...props}>
    {@render children?.()}
</button>
