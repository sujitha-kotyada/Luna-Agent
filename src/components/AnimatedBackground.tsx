import { motion } from 'framer-motion'

const stars = Array.from({ length: 52 }, (_, index) => ({
  id: index,
  left: `${(index * 17) % 97}%`,
  top: `${(index * 29) % 89}%`,
  delay: (index % 9) * 0.28,
  size: index % 6 === 0 ? 2 : 1,
}))

export function AnimatedBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[28px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_22%,rgba(51,86,153,0.26),transparent_34%),radial-gradient(circle_at_26%_52%,rgba(224,178,110,0.13),transparent_30%),linear-gradient(135deg,#03050b_0%,#07111f_47%,#02030a_100%)]" />
      <motion.div
        aria-hidden
        animate={{ opacity: [0.34, 0.58, 0.34], scale: [1, 1.04, 1] }}
        className="absolute -left-24 top-24 h-[520px] w-[760px] rotate-[-14deg] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(221,188,137,0.2),rgba(76,104,176,0.08)_38%,transparent_70%)] blur-2xl"
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        animate={{ opacity: [0.2, 0.46, 0.2], x: [0, 18, 0] }}
        className="absolute right-0 top-10 h-[620px] w-[760px] rotate-[20deg] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(98,121,205,0.28),rgba(94,54,157,0.11)_42%,transparent_72%)] blur-3xl"
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="absolute inset-0 opacity-[0.22] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.72)_1px,transparent_0)] [background-size:52px_52px]" />
      {stars.map((star) => (
        <motion.span
          aria-hidden
          className="absolute rounded-full bg-[#fff8df] shadow-[0_0_12px_rgba(255,231,184,0.75)]"
          key={star.id}
          style={{
            left: star.left,
            top: star.top,
            height: star.size,
            width: star.size,
          }}
          animate={{ opacity: [0.18, 0.9, 0.22] }}
          transition={{
            duration: 3.8 + (star.id % 5),
            repeat: Infinity,
            delay: star.delay,
          }}
        />
      ))}
      <div className="absolute inset-0 rounded-[28px] border border-[#dcb77c]/26" />
      <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-black/78 to-transparent" />
    </div>
  )
}
