import { LogOut } from "lucide-react"


interface LogOutBtnProps {
    onLogout: () => void
    className?: string
}
const LogOutBtn = ({ onLogout, className }: LogOutBtnProps) => {
    return (
        <button
            onClick={onLogout}
            className={`p-2 text-gray-400 hover:text-black transition-colors ${className}`}
            title="Logout"
            data-testid="auth-logout-button"
        >
            <LogOut size={20} />
        </button>
    )
}
export default LogOutBtn