
export function isPackageCommand(command) {
  if (!command) return false;

  const packages = [
    "apk add",
    "apk del",
    "apk update",
    "apk upgrade"
  ];

  return packages.some(cmd => command.startsWith(cmd));
}
