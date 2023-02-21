import { toast } from "react-toastify";

const handleGraphQLError = (error: GraphQLErrorResponse, callback?: () => void) => {
    toast.dismiss();

    if (error.response.errors) {
        error.response.errors.forEach((err) => {
            toast.error(err.message);
        });
    } else {
        toast.error("An error occurred");
    }

    if (callback) {
        callback();
    }
};

export default handleGraphQLError;
