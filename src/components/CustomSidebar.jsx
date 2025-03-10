import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";

export default function CustomSidebar({ accessKeyId }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:8099/store-aws-credentials/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key_id: "",
          secret_access_key: "",
          default_region: "",
        }),
      });

      if (res.ok) {
        sessionStorage.setItem("accessKeyId", null);
        sessionStorage.setItem("secretAccessKey", null);
        sessionStorage.setItem("region", null);
        router.push("/");
      } else {
        toast.error("Logout failed");
      }
    } catch (err) {
      toast.error("Logout error:", err);
    }
  };

  return (
    <Sidebar backgroundColor="#273142">
      <Menu
        menuItemStyles={{
          button: ({ level, active, disabled }) => {
            return {
              "&:hover": {
                color: "#273142",
                backgroundColor: "var(--foreground)",
              },
              color: active ? "#273142" : "var(--foreground)",
              backgroundColor: active ? "var(--foreground)" : "#273142",
            };
          },
        }}
      >
        <SubMenu label="Profiles">
          <MenuItem>
            {" "}
            Tests Dashboard: <br />
            <p style={{ fontSize: "0.8rem", fontWeight: "700" }}>
              Access Key ID: {accessKeyId}{" "}
            </p>
          </MenuItem>
          {
            // <MenuItem> Remedies </MenuItem>
          }
        </SubMenu>
        <MenuItem onClick={handleLogout}> Logout </MenuItem>
      </Menu>
    </Sidebar>
  );
}
