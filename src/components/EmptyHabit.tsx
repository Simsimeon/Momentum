import { motion } from "framer-motion"

const EmptyHabit = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 border-2 border-dashed border-gray-200 rounded-[2rem]"
            data-testid="empty-state"
        >
            <p className="text-gray-400">No habits yet. Start small!</p>
        </motion.div>
    )
}
export default EmptyHabit