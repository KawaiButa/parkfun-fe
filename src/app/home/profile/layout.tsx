
import ContainerFlexColumn from "@/components/containerFlexColumn/containerFlexColumn";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <ContainerFlexColumn
      sx={{
        padding: "10px !important",
        marginTop: "30px",
        borderRadius: "10px",
        alignSelf: "center",
        alignContent: "center",
        overflow: 'hidden',
      }}
      disableGutters
    >
      {children}
    </ContainerFlexColumn>
  );
};

layout.propTypes = {};

export default layout;
