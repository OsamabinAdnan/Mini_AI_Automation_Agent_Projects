'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

interface ImageComparisonProps {
  original: string;
  result: string;
}

export default function ImageComparison({ original, result }: ImageComparisonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div
        className="border rounded-xl p-6"
        style={{
          borderColor: 'var(--border)',
          background: 'var(--surface)',
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Original */}
          <div>
            <p
              className="text-xs mb-3"
              style={{ color: 'var(--text-secondary)' }}
            >
              Original
            </p>
            <div className="relative rounded-lg overflow-hidden aspect-square">
              <Image
                src={original}
                alt="Original"
                fill
                className="object-contain"
                style={{ background: 'var(--bg)' }}
              />
            </div>
          </div>

          {/* Result */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p
              className="text-xs mb-3"
              style={{ color: 'var(--text-secondary)' }}
            >
              Result
            </p>
            <div className="relative rounded-lg overflow-hidden aspect-square checkerboard">
              <Image
                src={result}
                alt="Result"
                fill
                className="object-contain"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
