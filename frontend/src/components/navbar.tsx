import { Link } from "react-router-dom"

export const Navbar = () => {

    return (
        <nav className="relative w-full bg-[#165bc6] overflow-hidden">
            <img
                src="https://giwmscdn.prixacdn.net/media/albums/topbg_CUCDohGKGe.png"
                alt="bg"
                className="absolute inset-0 w-full h-full object-cover opacity-70"
            />

            <div className="relative z-10 bg-[#235297]/90 w-fit p-4 flex items-center gap-3">
                <Link to={"/"}>
                    <img src="/logo.svg" alt="comp_logo" className="h-22.5 w-22.5" />
                </Link>
                <div className="flex flex-col text-white">
                    <h3>Government of Nepal</h3>
                    <h3>Ministry of Industry, Commerce and Supplies</h3>
                    <h2 className="font-bold">Office of the Registrar of Companies</h2>
                    <h2>Tripureshwor, Kathmandu, Nepal</h2>
                </div>
            </div>
        </nav>
    )
}