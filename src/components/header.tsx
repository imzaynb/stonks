import { ModeToggle } from "./mode-toggle";
import { mate_sc } from "@/lib/fonts";

const Header = () => {
    return (
        <header className={`${mate_sc.className} bg-accent flex justify-between items-center px-8 py-2`}>
            <div className="scroll-m-20 border-b pb-2 text-4xl font-semibold tracking-wide transition-colors first:mt-0">Stonks</div>
            <div className="flex items-center">
                <ModeToggle />
            </div>
        </header>
    )
}

export default Header;