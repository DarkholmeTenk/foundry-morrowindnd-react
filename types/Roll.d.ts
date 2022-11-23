export {}

declare global {
    class Roll {
        constructor(formula: string, data?: object, options?: object)

        evaluate(options: {async: true}): Promise<CompleteRoll>
    }

    class CompleteRoll extends Roll {
        total: number
    }
}