import { AxiosError } from "axios";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Shield,
  Users,
  Crown,
  Package,
  DollarSign,
  TrendingUp,
  Tags,
  FolderOpen,
  ShoppingCart,
  Receipt,
  UserPlus,
  UserX,
  Truck,
  Building2,
  FilePlus,
  Ban,
} from "lucide-react";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";

const proveedorStats = [
  {
    title: "Total Proveedores",
    value: "1,032",
    change: "+8%",
    changeType: "positive" as const,
    icon: Truck,
  },
  {
    title: "Proveedores Nuevos",
    value: "210",
    change: "+6%",
    changeType: "positive" as const,
    icon: UserPlus,
  },
  {
    title: "Proveedores Inactivos",
    value: "97",
    change: "-2%",
    changeType: "negative" as const,
    icon: UserX,
  },
  {
    title: "Retención de Proveedores",
    value: "79%",
    change: "+3%",
    changeType: "positive" as const,
    icon: TrendingUp,
  },
];

const clienteStats = [
  {
    title: "Total Clientes",
    value: "2,145",
    change: "+10%",
    changeType: "positive" as const,
    icon: Users,
  },
  {
    title: "Clientes Nuevos",
    value: "312",
    change: "+5%",
    changeType: "positive" as const,
    icon: UserPlus,
  },
  {
    title: "Clientes Inactivos",
    value: "128",
    change: "-3%",
    changeType: "negative" as const,
    icon: UserX,
  },
  {
    title: "Retención de Clientes",
    value: "87%",
    change: "+4%",
    changeType: "positive" as const,
    icon: TrendingUp,
  },
];

const negocioStats = [
  {
    title: "Total Negocios",
    value: "1,276",
    change: "+8%",
    changeType: "positive" as const,
    icon: Building2, // ejemplo de icono relacionado con negocios
  },
  {
    title: "Negocios Registrados este Mes",
    value: "198",
    change: "+12%",
    changeType: "positive" as const,
    icon: FilePlus, // ejemplo de registro nuevo
  },
  {
    title: "Negocios Inactivos",
    value: "74",
    change: "-6%",
    changeType: "negative" as const,
    icon: Ban, // ejemplo de inactividad
  },
  {
    title: "Crecimiento de Negocios",
    value: "91%",
    change: "+7%",
    changeType: "positive" as const,
    icon: TrendingUp, // crecimiento
  },
];

const stats = [
  {
    title: "Total Productos",
    value: "1,234",
    change: "+12%",
    changeType: "positive" as const,
    icon: Package,
  },
  {
    title: "Ventas del Mes",
    value: "$45,231",
    change: "+8%",
    changeType: "positive" as const,
    icon: DollarSign,
  },
  {
    title: "Clientes Activos",
    value: "573",
    change: "+23%",
    changeType: "positive" as const,
    icon: Users,
  },
  {
    title: "Crecimiento",
    value: "12.5%",
    change: "+2%",
    changeType: "positive" as const,
    icon: TrendingUp,
  },
];

const productActions = [
  {
    title: "Crear producto",
    description: "Crea un producto nuevo en el sistema",
    icon: Plus,
    permissions: "Cualquiera",
    permissionIcon: Users,
    color: "green",
    action: "create",
  },
  {
    title: "Actualizar producto",
    description: "Modifica un producto existente",
    icon: Edit,
    permissions: "Admin, Moderador",
    permissionIcon: Crown,
    color: "blue",
    action: "update",
  },
  {
    title: "Eliminar producto",
    description: "Borrar productos del sistema",
    icon: Trash2,
    permissions: "Admin",
    permissionIcon: Shield,
    color: "red",
    action: "delete",
  },
  {
    title: "Ver todos",
    description: "Visualizar todos los productos",
    icon: Eye,
    permissions: "Cualquiera",
    permissionIcon: Users,
    color: "purple",
    action: "view",
  },
];

const clientesActions = [
  {
    title: "Crear cliente",
    description: "Agrega un nuevo cliente al sistema",
    icon: Plus,
    permissions: "Cualquiera",
    permissionIcon: Users,
    color: "green",
    action: "create",
  },
  {
    title: "Actualizar cliente",
    description: "Edita la información de un cliente existente",
    icon: Edit,
    permissions: "Admin, Moderador",
    permissionIcon: Crown,
    color: "blue",
    action: "update",
  },
  {
    title: "Eliminar cliente",
    description: "Elimina un cliente del sistema",
    icon: Trash2,
    permissions: "Admin",
    permissionIcon: Shield,
    color: "red",
    action: "delete",
  },
  {
    title: "Ver todos",
    description: "Consulta todos los clientes registrados",
    icon: Eye,
    permissions: "Cualquiera",
    permissionIcon: Users,
    color: "purple",
    action: "view",
  },
];

const negociosActions = [
  {
    title: "Registrar negocio",
    description: "Agrega un nuevo negocio al sistema",
    icon: Plus,
    permissions: "Cualquiera",
    permissionIcon: Users,
    color: "green",
    action: "create",
  },
  {
    title: "Actualizar negocio",
    description: "Edita la información de un negocio existente",
    icon: Edit,
    permissions: "Admin, Moderador",
    permissionIcon: Crown,
    color: "blue",
    action: "update",
  },
  {
    title: "Eliminar negocio",
    description: "Elimina un negocio del sistema",
    icon: Trash2,
    permissions: "Admin",
    permissionIcon: Shield,
    color: "red",
    action: "delete",
  },
  {
    title: "Ver todos",
    description: "Consulta todos los negocios registrados",
    icon: Eye,
    permissions: "Cualquiera",
    permissionIcon: Users,
    color: "purple",
    action: "view",
  },
  {
    title: "Crear tipo de negocio",
    description: "Crea un tipo de negocio nuevo",
    icon: Plus,
    permissions: "Cualquiera",
    permissionIcon: Users,
    color: "green",
    action: "create-type",
  },
];

const proveedoresActions = [
  {
    title: "Crear proveedor",
    description: "Agrega un nuevo proveedor al sistema",
    icon: Plus,
    permissions: "Cualquiera",
    permissionIcon: Users,
    color: "green",
    action: "create",
  },
  {
    title: "Actualizar proveedor",
    description: "Edita la información de un proveedor existente",
    icon: Edit,
    permissions: "Admin, Moderador",
    permissionIcon: Crown,
    color: "blue",
    action: "update",
  },
  {
    title: "Eliminar proveedor",
    description: "Elimina un proveedor del sistema",
    icon: Trash2,
    permissions: "Admin",
    permissionIcon: Shield,
    color: "red",
    action: "delete",
  },
  {
    title: "Ver todos",
    description: "Consulta todos los proveedores registrados",
    icon: Eye,
    permissions: "Cualquiera",
    permissionIcon: Users,
    color: "purple",
    action: "view",
  },
  {
    title: "Asignar productos",
    description: "Asigna productos a un proveedor",
    icon: Package,
    permissions: "Admin, Moderador",
    permissionIcon: Crown,
    color: "orange",
    action: "assign-products",
  },
];

const tiposActions = [
  {
    title: "Crear tipo",
    description: "Crea un tipo nuevo en el sistema",
    icon: Plus,
    permissions: "Cualquiera",
    permissionIcon: Users,
    color: "green",
    action: "create",
  },
  {
    title: "Actualizar tipo",
    description: "Modifica un tipo existente",
    icon: Edit,
    permissions: "Admin, Moderador",
    permissionIcon: Crown,
    color: "blue",
    action: "update",
  },
  {
    title: "Eliminar tipo",
    description: "Borrar tipos del sistema",
    icon: Trash2,
    permissions: "Admin",
    permissionIcon: Shield,
    color: "red",
    action: "delete",
  },
  {
    title: "Ver todos",
    description: "Visualizar todos los tipos",
    icon: Eye,
    permissions: "Cualquiera",
    permissionIcon: Users,
    color: "purple",
    action: "view",
  },
];

const categoriasActions = [
  {
    title: "Crear categoria",
    description: "Crea una categoria nueva en el sistema",
    icon: Plus,
    permissions: "Cualquiera",
    permissionIcon: Users,
    color: "green",
    action: "create",
  },
  {
    title: "Actualizar categoria",
    description: "Modifica una categoria existente",
    icon: Edit,
    permissions: "Admin, Moderador",
    permissionIcon: Crown,
    color: "blue",
    action: "update",
  },
  {
    title: "Eliminar categoria",
    description: "Borrar categorias del sistema",
    icon: Trash2,
    permissions: "Admin",
    permissionIcon: Shield,
    color: "red",
    action: "delete",
  },
  {
    title: "Ver todas",
    description: "Visualizar todas las categorias",
    icon: Eye,
    permissions: "Cualquiera",
    permissionIcon: Users,
    color: "purple",
    action: "view",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const getColorClasses = (color: string) => {
  const colors = {
    green:
      "hover:border-green-200 dark:hover:border-green-800 hover:border-green-300 dark:hover:border-green-700",
    blue: "hover:border-blue-200 dark:hover:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700",
    red: "hover:border-red-200 dark:hover:border-red-800 hover:border-red-300 dark:hover:border-red-700",
    purple:
      "hover:border-purple-200 dark:hover:border-purple-800 hover:border-purple-300 dark:hover:border-purple-700",
  };
  return colors[color as keyof typeof colors] || colors.green;
};

const getIconColorClasses = (color: string) => {
  const colors = {
    green: "text-green-600 dark:text-green-400",
    blue: "text-blue-600 dark:text-blue-400",
    red: "text-red-600 dark:text-red-400",
    purple: "text-purple-600 dark:text-purple-400",
  };
  return colors[color as keyof typeof colors] || colors.green;
};

const getBadgeColorClasses = (color: string) => {
  const colors = {
    green:
      "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
    blue: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
    red: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
    purple:
      "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800",
  };
  return colors[color as keyof typeof colors] || colors.green;
};

const sidebarItems = [
  {
    title: "Productos",
    icon: Package,
    href: "/dashboard/productos",
  },
  {
    title: "Tipos de Productos",
    icon: Tags,
    href: "/dashboard/tipos",
  },
  {
    title: "Categorias de Productos",
    icon: FolderOpen,
    href: "/dashboard/categorias",
  },
  {
    title: "Negocios",
    icon: ShoppingCart,
    href: "/dashboard/negocios",
  },
  {
    title: "Clientes",
    icon: Receipt,
    href: "/dashboard/clientes",
  },
  {
    title: "Proveedores",
    icon: Users,
    href: "/dashboard/proveedores",
  },
];

const returnErrorMessage = (error: AxiosError) => {
  if (error.response?.status === 400) {
    toast.error("Error de validación. Por favor, corrija los errores.");
  }

  if (error.response?.status === 401) {
    toast.error("Unauthorized access. Please log in.");
    signOut({ redirect: true, callbackUrl: "/auth/login" });
  }

  if (error.response?.status === 500) {
    toast.error("Internal server error. Please try again later.");
  }

  if (error.response?.status === 403) {
    toast.error(
      "Forbidden access. You do not have permission to perform this action."
    );
  }

  if (error.response?.status === 404) {
    toast.error("Resource not found. Please check the URL.");
  }
};

export {
  returnErrorMessage,
  stats,
  productActions,
  containerVariants,
  cardVariants,
  getColorClasses,
  getIconColorClasses,
  getBadgeColorClasses,
  sidebarItems,
  tiposActions,
  categoriasActions,
  clientesActions,
  clienteStats,
  proveedorStats,
  proveedoresActions,
  negocioStats,
  negociosActions,
};
