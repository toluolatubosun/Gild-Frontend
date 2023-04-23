import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

interface Props {
    users: {
        id: string;
        name: string;
        role: string;
        email: string;
        isActive: boolean;
        wallet: {
            balance: number;
        };
    }[];
    isDisabled: boolean;
    hasNext: () => boolean;
    hasPrevious: () => boolean;
    goToNext: () => void;
    goToPrevious: () => void;
    updateRole: (userId: string, role: string) => void;
    updateStatus: (userId: string, isActive: boolean) => void;
}

const UsersTable = ({ users, isDisabled, hasNext, hasPrevious, goToNext, goToPrevious, updateStatus, updateRole }: Props) => {
    return (
        <>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-4">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="font-Sora text-base text-white tracking-wider capitalize bg-primary">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Email
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Wallet Balance
                            </th>
                            <th scope="col" className="px-6 py-3">
                                <span className="sr-only">Role</span>
                            </th>
                            <th scope="col" className="px-6 py-3">
                                <span className="sr-only">Status</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="font-medium">
                        {users.map((user) => (
                            <tr key={user.id} className="border-b odd:bg-white even:bg-secondary/10">
                                <td className="px-6 py-4">{user.name}</td>
                                <td className="px-6 py-4">{user.email}</td>
                                <td className="px-6 py-4">{user.wallet.balance.toLocaleString("en-US")}</td>
                                <td className="px-6 py-4">
                                    <button
                                        disabled={isDisabled}
                                        className={`font-semibold disabled:text-gray-400 ${user.role === "admin" ? "text-red-500" : "text-green-500"}`}
                                        onClick={() => {
                                            let role = user.role === "admin" ? "user" : "admin";
                                            updateRole(user.id, role);
                                        }}
                                    >
                                        {user.role === "admin" ? "Revoke Admin Access" : "Grant Admin Access"}
                                    </button>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        disabled={isDisabled}
                                        className={`font-semibold disabled:text-gray-400 ${user.isActive === true ? "text-red-500" : "text-green-500"}`}
                                        onClick={() => updateStatus(user.id, !user.isActive)}
                                    >
                                        {user.isActive === true ? "Disable" : "Enable"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-col items-center mt-6">
                <div className="inline-flex mt-2 xs:mt-0">
                    <button
                        onClick={goToPrevious}
                        disabled={!hasPrevious()}
                        className="flex flex-row w-fit items-center py-2 px-4 mr-3 text-sm font-medium text-white bg-secondary rounded-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        <FiArrowLeft className="mr-2 text-lg" />
                        Previous
                    </button>
                    <button
                        onClick={goToNext}
                        disabled={!hasNext()}
                        className="flex flex-row w-fit items-center py-2 px-4 mr-3 text-sm font-medium text-white bg-secondary rounded-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        Next
                        <FiArrowRight className="ml-2 text-lg" />
                    </button>
                </div>
            </div>
        </>
    );
};

export default UsersTable;
