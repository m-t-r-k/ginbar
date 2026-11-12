import React from "react";
import { motion } from "framer-motion";

export default function MotionWrapper(props) {
    return (
        <motion.div
        initial={{ opacity: 0, x: 25 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0 , x: -25}}
        transition={{ duration: 0.15 }}
        >
            {props.children}
        </motion.div>
    );
}