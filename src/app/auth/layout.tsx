import AuthButton from "@/components/authButton/authButton";
import ContainerFlexColumn from "@/components/containerFlexColumn/containerFlexColumn";
const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <ContainerFlexColumn
      maxWidth="sm"
      sx={{
        marginTop: "30px",
        backgroundColor: "var(--secondary-color)",
        padding: "30px",
        borderRadius: "10px",
        gap: "20px",
      }}
      disableGutters
    >

      <AuthButton/>
      {children}
    </ContainerFlexColumn>
  );
};

layout.propTypes = {};

export default layout;
