const Container = ({ children }: { children: any }) => {
  return (
    <main className="flex-1 h-full">
      <div className="h-full flex flex-col xl:max-w-[1340px] mx-auto" >{children}</div>
    </main>
  );
};

export default Container;
