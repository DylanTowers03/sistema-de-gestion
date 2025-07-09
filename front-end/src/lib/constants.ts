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

} from "lucide-react";
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
  }
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
  }
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
    title: "Tipos",
    icon: Tags,
    href: "/dashboard/tipos",
  },
  {
    title: "Categorias",
    icon: FolderOpen,
    href: "/dashboard/categorias",
  },
  {
    title: "Ventas",
    icon: ShoppingCart,
    href: "/dashboard/ventas",
    badge: "Pronto",
    disabled: true,
  },
  {
    title: "Gastos",
    icon: Receipt,
    href: "/dashboard/gastos",
    badge: "Pronto",
    disabled: true,
  },
  {
    title: "Proveedores",
    icon: Users,
    href: "/dashboard/proveedores",
    badge: "Pronto",
    disabled: true,
  },
];

  export {
    stats,
    productActions,
    containerVariants,
    cardVariants,
    getColorClasses,
    getIconColorClasses,
    getBadgeColorClasses,    
    sidebarItems,
    tiposActions,
    categoriasActions
  };