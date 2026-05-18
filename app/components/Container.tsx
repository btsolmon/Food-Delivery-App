interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const Container = ({ children, className = "" }: ContainerProps) => {
  return (
    <div className={`w-full max-w-360 mx-auto px-20 ${className}`}>
      {children}
    </div>
  );
};