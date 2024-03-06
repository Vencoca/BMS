const roles = {
  OWNER: "owner",
  EDITOR: "editor",
  USER: "user",
};

const rolePermissions = {
  [roles.OWNER]: ["read", "write", "update", "delete"],
  [roles.EDITOR]: [""],
  [roles.USER]: ["read"],
};

export { rolePermissions, roles };
