import React from "react";
import Head from "next/head";
import ReactModal from "react-modal";
import { toast } from "react-toastify";
import { MdClose } from "react-icons/md";
import { useQueryClient } from "@tanstack/react-query";

import { userCreate, userGetAll, userUpdate } from "../../../api";
import { InputField, SideNavLayout, UsersTable } from "../../../components";
import { handleGraphQLError, useGQLMutation, useGQLQuery, withAuth } from "../../../utils";

import type { NextPage } from "next";

const ManageUsers: NextPage = () => {
    const queryClient = useQueryClient();

    const [modalIsOpen, setIsOpen] = React.useState(false);
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    const [users, setUsers] = React.useState([]);
    const [usersCursors, setUsersCursors] = React.useState<string[]>([""]);
    const [usersCursorIndex, setUsersCursorIndex] = React.useState<number>(0);
    const [usersPagination, setUsersPagination] = React.useState({ next: "", limit: 15 });

    const [createUserFrom, setCreateUserForm] = React.useState({
        name: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: ""
    });

    const { mutate: updateUser, isLoading: isUpdatingUser } = useGQLMutation(userUpdate, {
        onMutate: () => {
            toast.dismiss();
            toast.loading("Loading... Please wait", { autoClose: false });
        },
        onSuccess: async () => {
            toast.dismiss();
            toast.success("User updated successfully");

            await queryClient.refetchQueries(["all-users", usersPagination.next], { exact: true });
        },
        onError: (error: GraphQLErrorResponse) => {
            handleGraphQLError(error);
        }
    });

    const { isFetching: isFetchingUsers, isLoading: isLoadingUsers } = useGQLQuery(
        ["all-users", usersPagination.next],
        { query: userGetAll, variables: { pagination: usersPagination } },
        {
            onSuccess: ({ data }) => {
                setUsers(data.users);

                if (data.pagination.hasNext && !usersCursors.includes(data.pagination.next)) {
                    setUsersCursors((prev) => [...prev, data.pagination.next]);
                }
            },
            onError: (error: GraphQLErrorResponse) => {
                handleGraphQLError(error);
            }
        }
    );

    const hasNext = () => usersCursorIndex !== usersCursors.length - 1 && !isFetchingUsers && !isLoadingUsers;
    const goToNext = () => {
        if (!hasNext) return;
        setUsersPagination({ ...usersPagination, next: usersCursors[usersCursorIndex + 1] });
        setUsersCursorIndex((prev) => prev + 1);
    };

    const hasPrevious = () => usersCursorIndex !== 0 && !isFetchingUsers && !isLoadingUsers;
    const goToPrevious = () => {
        if (!hasPrevious) return;
        setUsersPagination({ ...usersPagination, next: usersCursors[usersCursorIndex - 1] });
        setUsersCursorIndex((prev) => prev - 1);
    };

    const { mutate: createUser, isLoading: isCreatingUser } = useGQLMutation(userCreate, {
        onSuccess: () => {
            toast.dismiss();
            toast.success("User create successfully");

            setCreateUserForm({
                name: "",
                email: "",
                username: "",
                password: "",
                confirmPassword: ""
            });

            closeModal();
        },
        onError: (error: GraphQLErrorResponse) => {
            handleGraphQLError(error);
        }
    });

    const handleCreateUser = (e: any) => {
        e.preventDefault();

        if (createUserFrom.password != createUserFrom.confirmPassword) {
            toast.warning("Password does not match");
            return;
        }

        toast.loading("Loading... Please wait", { autoClose: false });

        const { name, email, username, password } = createUserFrom;
        createUser({ input: { name, email, username, password } });
    };

    return (
        <>
            <Head>
                <title>Manage Users | Gild</title>
            </Head>

            <SideNavLayout isAdmin={true}>
                <div className="my-5">
                    <h1 className="font-Sora font-bold text-3xl">Manage Users</h1>
                </div>

                <div className="px-4 md:px-8 lg:px-16 py-12 bg-secondary rounded-lg shadow-lg text-center text-white md:mt-10">
                    <h1 className="font-Sora font-bold text-2xl md:text-3xl lg:text-4xl">
                        Manage all <span className="text-primary">Gild</span> users
                    </h1>
                    <p className="font-bold text-lg md:text-xl lg:text-2xl mt-5">Monitor users and perform various actions</p>

                    <button onClick={openModal} className="bg-primary text-secondary font-Sora font-bold tracking-wide text-lg md:text-xl lg:text-2xl px-6 py-2 rounded-sm mt-7">
                        Create User
                    </button>
                </div>

                <br />

                <UsersTable
                    users={users}
                    isDisabled={isUpdatingUser}
                    hasNext={hasNext}
                    hasPrevious={hasPrevious}
                    goToNext={goToNext}
                    goToPrevious={goToPrevious}
                    updateRole={(userId: string, role: string) => updateUser({ userId, input: { role } })}
                    updateStatus={(userId: string, isActive: boolean) => updateUser({ userId, input: { isActive } })}
                />
            </SideNavLayout>

            <ReactModal
                ariaHideApp={false}
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Create User Modal"
                shouldCloseOnOverlayClick={false}
                className="bg-white p-5 w-3/4 lg:w-2/5 rounded-sm shadow-2xl"
                overlayClassName="bg-black/50 fixed inset-0 z-50 flex items-center justify-center"
            >
                <div className="w-full">
                    <div className="flex place-content-end">
                        <MdClose onClick={closeModal} className="text-2xl cursor-pointer text-secondary hover:text-primary" />
                    </div>

                    <form id="SingUpForm" className="mb-0 space-y-6" method="POST" onSubmit={handleCreateUser}>
                        <InputField
                            label="Full Name"
                            value={createUserFrom.name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCreateUserForm({ ...createUserFrom, name: e.target.value })}
                            type="text"
                            required={true}
                            name="fullName"
                        />

                        <InputField
                            label="Username"
                            value={createUserFrom.username}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCreateUserForm({ ...createUserFrom, username: e.target.value })}
                            type="text"
                            required={true}
                            name="Username"
                        />

                        <InputField
                            label="Email Address"
                            value={createUserFrom.email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCreateUserForm({ ...createUserFrom, email: e.target.value })}
                            type="email"
                            required={true}
                            name="email"
                        />

                        <div className="md:flex md:space-x-4 space-y-6 md:space-y-0">
                            <InputField
                                label="Password"
                                value={createUserFrom.password}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCreateUserForm({ ...createUserFrom, password: e.target.value })}
                                type="password"
                                required={true}
                                name="password"
                            />

                            <InputField
                                label="Confirm Password"
                                value={createUserFrom.confirmPassword}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCreateUserForm({ ...createUserFrom, confirmPassword: e.target.value })}
                                type="password"
                                required={true}
                                name="confirmPassword"
                            />
                        </div>

                        <button type="submit" className="btn-auth-form" disabled={isCreatingUser}>
                            Create User
                        </button>
                    </form>
                </div>
            </ReactModal>
        </>
    );
};

export default withAuth(ManageUsers);
