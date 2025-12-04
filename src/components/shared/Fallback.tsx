type FallbackProps = {
  loading: boolean;
  loader?: React.ReactNode;
  children: React.ReactNode;
};

const Fallback: React.FC<FallbackProps> = ({
  loader,
  loading = false,
  children,
}) => {
  if (loading) {
    return <div>{loader ?? <>Загружаем</>}</div>;
  }

  return children;
};

export default Fallback;
