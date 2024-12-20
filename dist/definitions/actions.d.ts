export type Action<T extends string> = {
    type: T;
};
export type ActionWithPayload<T extends string, P> = Action<T> & {
    payload: P;
};
export type PayloadsTree = Record<string, any>;
//# sourceMappingURL=actions.d.ts.map