import Loading from "../Loading/Loading";
import SideNav from "../Navigation/Side-Nav";
import SimpleFooter from "../Footer/Simple-Footer";
import AdminSideNav from "../Navigation/Admin-Side-Nav";

import { useUser } from "../../utils";
import { useRouter } from "next/router";

interface dashboardLayoutProps {
    children: any;
    isAdmin?: boolean;
    isLoading?: boolean;
}

const SideNavLayout = ({ children, isLoading, isAdmin = false }: dashboardLayoutProps) => {
    const { user } = useUser();
    const router = useRouter();

    if (user && isAdmin && user.role !== "admin") {
        router.replace("/app");
    }

    return (
        <>
            {isAdmin ? <AdminSideNav /> : <SideNav />}

            <div className="relative md:ml-64">
                <div className="flex flex-col h-screen">
                    <div className="px-6 md:px-12 flex-grow">{isLoading || !user ? <Loading isParent={true} /> : children}</div>

                    <SimpleFooter />
                </div>
            </div>
        </>
    );
};

export default SideNavLayout;
