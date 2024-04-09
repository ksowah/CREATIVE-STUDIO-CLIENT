const Container = ({ children }: { children: any }) => {
  return (
    <main className="flex-1 h-full px-4 xl:px-0">
      <div className="h-full flex flex-col w-full xl:max-w-[1340px] mx-auto" >{children}</div>
    </main>
  );
};

export default Container;
