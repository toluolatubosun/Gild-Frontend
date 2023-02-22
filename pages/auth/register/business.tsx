import React from "react";
import Link from "next/link";
import Head from "next/head";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { setCookies } from "cookies-next";
import { Country, State, City } from "country-state-city";

import { authRegisterBusiness } from "../../../api";
import { CardLayout, InputField, SelectField } from "../../../components";
import { companySizeData, handleGraphQLError, industryData, useGQLMutation, withoutAuth } from "../../../utils";

import type { NextPage } from "next";

const SignUp: NextPage = () => {
    const router = useRouter();

    const HandleSubmit = (e: any) => {
        e.preventDefault();

        if (formData.password != formData.confirmPassword) {
            toast.warning("Password does not match");
            return;
        }

        toast.loading("Loading... Please wait", { autoClose: false });

        const { name, email, role, username, password, city, state, country, companySize, industry } = formData;
        mutate({
            input: { name, email, role, username, password },
            businessData: { city, state: state.name, country: country.name, companySize, industry }
        });
    };

    const { mutate, isLoading } = useGQLMutation(authRegisterBusiness, {
        onSuccess: ({ response }: any) => {
            toast.dismiss();
            toast.success("Registration Successful");

            setCookies("access_token", response.token.accessToken);
            setCookies("refresh_token", response.token.refreshToken);

            router.replace(`/auth/on-boarding?email=${response.user.email}`);
        },
        onError: (error: GraphQLErrorResponse) => {
            handleGraphQLError(error);
        }
    });

    const [formData, setFormData] = React.useState({
        name: "",
        email: "",
        username: "",
        password: "",
        role: "business",
        confirmPassword: "",
        city: "",
        state: {
            name: "",
            code: ""
        },
        country: {
            name: "",
            code: ""
        },
        industry: "",
        companySize: ""
    });

    return (
        <>
            <Head>
                <title>Register Business Account | Gild</title>
            </Head>

            <CardLayout large>
                <h1 className="font-Sora font-bold text-2xl text-center text-secondary mb-4 tracking-wide">Create An Account</h1>

                <form id="SingUpForm" className="mb-0 space-y-6" method="POST" onSubmit={HandleSubmit}>
                    <div className="md:flex md:space-x-4 space-y-6 md:space-y-0">
                        <InputField
                            label="Business Name"
                            value={formData.name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                            type="text"
                            required={true}
                            name="BusinessName"
                        />

                        <InputField
                            label="Email Address"
                            value={formData.email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
                            type="email"
                            required={true}
                            name="email"
                        />
                    </div>

                    <InputField
                        label="Business Handle"
                        value={formData.username}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, username: e.target.value })}
                        type="text"
                        required={true}
                        name="Username"
                    />

                    <SelectField
                        label="Country"
                        value={formData.country.code}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                            setFormData({
                                ...formData,
                                city: "",
                                state: { name: "", code: "" },
                                country: { name: Country.getCountryByCode(e.target.value)?.name || "", code: e.target.value }
                            })
                        }
                        name="country"
                        required={true}
                        options={Country.getAllCountries().map((country) => {
                            return {
                                label: country.name,
                                value: country.isoCode
                            };
                        })}
                    />

                    <div className="md:flex md:space-x-4 space-y-6 md:space-y-0">
                        <SelectField
                            label="State"
                            value={formData.state.code}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                setFormData({
                                    ...formData,
                                    city: "",
                                    state: { name: State.getStateByCodeAndCountry(e.target.value, formData.country.code)?.name || "", code: e.target.value }
                                })
                            }
                            name="state"
                            required={true}
                            options={
                                State.getStatesOfCountry(formData.country.code).length === 0
                                    ? [{ label: "No State Available", value: "N/A" }]
                                    : State.getStatesOfCountry(formData.country.code).map((state) => {
                                          return {
                                              label: state.name,
                                              value: state.isoCode
                                          };
                                      })
                            }
                        />

                        <SelectField
                            label="City"
                            value={formData.city}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, city: e.target.value })}
                            name="city"
                            required={true}
                            options={
                                City.getCitiesOfState(formData.country.code, formData.state.code).length === 0
                                    ? [{ label: "No City Available", value: "N/A" }]
                                    : City.getCitiesOfState(formData.country.code, formData.state.code).map((city) => {
                                          return {
                                              label: city.name,
                                              value: city.name
                                          };
                                      })
                            }
                        />
                    </div>

                    <div className="md:flex md:space-x-4 space-y-6 md:space-y-0">
                        <SelectField
                            label="Industry"
                            value={formData.industry}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, industry: e.target.value })}
                            name="industry"
                            required={true}
                            options={industryData}
                        />

                        <SelectField
                            label="Company Size"
                            value={formData.companySize}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, companySize: e.target.value })}
                            name="companySize"
                            required={true}
                            options={companySizeData}
                        />
                    </div>

                    <div className="md:flex md:space-x-4 space-y-6 md:space-y-0">
                        <InputField
                            label="Password"
                            value={formData.password}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, password: e.target.value })}
                            type="password"
                            required={true}
                            name="password"
                        />

                        <InputField
                            label="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            type="password"
                            required={true}
                            name="confirmPassword"
                        />
                    </div>

                    <p className="ext-sm font-medium mt-4 text-gray-600">
                        <Link href="/auth/login" passHref>
                            <span className="text-primary cursor-pointer">Login Instead</span>
                        </Link>
                    </p>

                    <div>
                        <button disabled={isLoading} type="submit" className="btn-auth-form">
                            Register
                        </button>
                    </div>
                </form>

                <p className="text-center text-sm font-medium mt-4 text-gray-600">
                    Want to Register a Personal Account?{" "}
                    <Link href="/auth/register/user" passHref>
                        <span className="text-primary cursor-pointer">Click Here</span>
                    </Link>
                </p>
            </CardLayout>
        </>
    );
};

export default withoutAuth(SignUp);
