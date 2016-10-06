interface ObjectConstructor {
    assign(target: any, ...sources: any[]): any;
}

interface String {
    startsWith(searchString: string, position?: number): boolean;
}