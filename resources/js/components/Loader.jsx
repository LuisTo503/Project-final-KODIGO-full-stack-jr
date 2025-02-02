// components/Loader.jsx
export default function Loader({ size = 'h-12 w-12', color = 'border-pink-500' }) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className={`animate-spin rounded-full ${size} border-4 ${color} border-t-transparent`}></div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }