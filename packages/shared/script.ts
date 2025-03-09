export const createScript = <T>({ name, fn }: { name: string; fn: (runtime: T) => void }) => {
    return { name, fn };
};
