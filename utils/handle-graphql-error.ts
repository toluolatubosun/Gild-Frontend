import { toast } from "react-toastify";

const handleGraphQLError = (error: GraphQLErrorResponse, callback?: () => void) => {
    toast.dismiss();

    if (error.response && error.response.errors) {
        error.response.errors.forEach((err) => {
            toast.error(err.message);
        });
    } else {
        toast.error(error.message || "An error occurred");
    }

    if (callback) {
        callback();
    }
};

export default handleGraphQLError;
