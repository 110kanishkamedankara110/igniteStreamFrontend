const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const ui = (
  <div className="w-screen h-screen flex justify-center items-center p-10" style={{
    backgroundColor:'#FFF5E0'
  }}>
      {children}
    </div>
    );
  return ui;
};

export default layout;
