import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";
import useHabitStore from "@/store/useHabitStore";
import useAuthStore from "@/store/useAuthStore";
import getHabitSlug from "@/lib/slug"

interface ModalProps {
    name: string;
    isOpen: boolean,
    onClose: () => void,
    habitId: string
}
const Modal = ({ name, habitId, isOpen, onClose }: ModalProps) => {
    const { user } = useAuthStore();
    const slug = getHabitSlug(name)
    const { deleteHabit, habits } = useHabitStore();
    const userHabits = habits.filter(h => h.userId === user?.id);
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => onClose()}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                data-testid={`habit-delete${slug}`}
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="bg-white rounded-[2rem] p-8 shadow-2xl max-w-sm w-full relative z-[101]"
            >
                <div className="text-center"

                >
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Trash2 size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Habit?</h3>
                    <p className="text-gray-500 mb-8 text-sm break-words">
                        Are you sure you want to delete this habit <span className="break-words font-semibold text-gray-900">"{name}"</span>? This action cannot be undone.
                    </p>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-3 rounded-xl font-medium text-gray-500 hover:bg-gray-50 transition-colors text-sm border border-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                deleteHabit(habitId);
                                onClose();
                            }}
                            className="flex-1 px-6 py-3 rounded-xl font-medium bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all text-sm"
                            data-testid="confirm-delete-button"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
export default Modal
{/* <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowDeleteConfirm(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="bg-white rounded-[2rem] p-8 shadow-2xl max-w-sm w-full relative z-[101]"
                        >
                            <div className="text-center">
                                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <Trash2 size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Habit?</h3>
                                <p className="text-gray-500 mb-8 text-sm">
                                    Are you sure you want to delete <span className="font-semibold text-gray-900">"{name}"</span>? This action cannot be undone.
                                </p>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowDeleteConfirm(false)}
                                        className="flex-1 px-6 py-3 rounded-xl font-medium text-gray-500 hover:bg-gray-50 transition-colors text-sm border border-gray-100"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            deleteHabit(habitId);
                                            setShowDeleteConfirm(false);
                                        }}
                                        className="flex-1 px-6 py-3 rounded-xl font-medium bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all text-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div> */}