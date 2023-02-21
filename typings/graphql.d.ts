interface GraphQLErrorResponse {
    response: {
        errors: [
            {
                message: string;
                locations: [{ line: number; column: number }];
                extensions: { code: string; stacktrace: string[] };
            }
        ];
        headers: any;
        status: number;
    };
}
