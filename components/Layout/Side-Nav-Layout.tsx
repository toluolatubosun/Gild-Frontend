import Loading from "../Loading/Loading";
import SideNav from "../Navigation/Side-Nav";
import SimpleFooter from "../Footer/Simple-Footer";

interface dashboardLayoutProps {
    children: any;
    isLoading?: boolean;
}

const SideNavLayout = ({ children, isLoading }: dashboardLayoutProps) => {
    return (
        <>
            <SideNav />

            <div className="relative md:ml-64">
                <div className="flex flex-col h-screen">
                    <div className="px-6 md:px-12 flex-grow">{isLoading ? <Loading isParent={true} /> : children}</div>

                    <SimpleFooter />
                </div>
            </div>
        </>
    );
};

export default SideNavLayout;
