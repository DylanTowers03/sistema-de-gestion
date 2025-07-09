"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Download, Filter } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description: string;
  itemCount: number;
  itemLabel: string;
  onAdd?: () => void;
  onExport?: () => void;
  onFilter?: () => void;
  addLabel?: string;
  showAddButton?: boolean;
  showExportButton?: boolean;
  showFilterButton?: boolean;
}

export function PageHeader({
  title,
  description,
  itemCount,
  itemLabel,
}: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl font-bold tracking-tight"
          >
            {title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground"
          >
            {description}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center space-x-3"
        >
          <Badge variant="secondary" className="text-sm">
            {itemCount} {itemLabel}
          </Badge>
        </motion.div>
      </div>

      <Separator />
    </motion.div>
  );
}
