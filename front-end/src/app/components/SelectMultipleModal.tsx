import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useMemo } from "react";
import { Search, X, Plus } from "lucide-react";

type SelectMultipleModalProps<TPrimary, TSecondary> = {
  isOpen: boolean;
  title: string;
  description: string;
  sectionPrimary: string;
  sectionSecondary: string;
  dataPrimary: TPrimary[];
  dataSecondary: TSecondary[];
  onClose: () => void;
  onSubmit: (selected: {
    primary: TPrimary | null;
    secondary: TSecondary[];
  }) => void;
  renderPrimaryItem: (item: TPrimary, selected: boolean) => React.ReactNode;
  renderSecondaryItem: (item: TSecondary, selected: boolean) => React.ReactNode;
  getPrimaryId: (item: TPrimary) => string | number;
  getSecondaryId: (item: TSecondary) => string | number;
};

export function SelectMultipleModal<TPrimary, TSecondary>({
  isOpen,
  title,
  description,
  sectionPrimary,
  sectionSecondary,
  dataPrimary,
  dataSecondary,
  onClose,
  onSubmit,
  renderPrimaryItem,
  renderSecondaryItem,
  getPrimaryId,
  getSecondaryId,
}: SelectMultipleModalProps<TPrimary, TSecondary>) {
  const [search, setSearch] = useState("");
  const [selectedPrimary, setSelectedPrimary] = useState<TPrimary | null>(null);
  const [selectedSecondary, setSelectedSecondary] = useState<TSecondary[]>([]);

  const toggleSecondary = (item: TSecondary) => {
    const id = getSecondaryId(item);
    setSelectedSecondary((prev) =>
      prev.some((el) => getSecondaryId(el) === id)
        ? prev.filter((el) => getSecondaryId(el) !== id)
        : [...prev, item]
    );
  };

  const handleOnClose = () => {
    setSearch("");
    setSelectedPrimary(null);
    setSelectedSecondary([]);
    onClose();
  };

  const filteredPrimary = useMemo(() => {
    return dataPrimary.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(search.toLowerCase())
    );
  }, [search, dataPrimary]);

  const filteredSecondary = useMemo(() => {
    return dataSecondary.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(search.toLowerCase())
    );
  }, [search, dataSecondary]);

  const handleSubmit = () => {
    onSubmit({ primary: selectedPrimary, secondary: selectedSecondary });
    setSelectedPrimary(null);
    setSelectedSecondary([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Primary Selection (1) */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              Seleccionar {sectionPrimary}
            </h4>
            <ScrollArea className="h-[100px] w-full border rounded-md p-2 space-y-2">
              <AnimatePresence>
                {filteredPrimary.map((item) => {
                  const id = getPrimaryId(item);
                  const isSelected =
                    selectedPrimary && getPrimaryId(selectedPrimary) === id;
                  return (
                    <motion.div
                      key={id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card
                        className={`cursor-pointer transition-all duration-200 hover:shadow-md `}
                        onClick={() => setSelectedPrimary(item)}
                      >
                        <CardContent className="p-4">
                          {renderPrimaryItem(item, isSelected ?? false)}
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </ScrollArea>
          </div>

          {/* Secondary Selection (multiple) */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              Seleccionar {sectionSecondary}
            </h4>
            <ScrollArea className="h-[160px] w-full border rounded-md p-2 space-y-2">
              <AnimatePresence>
                {filteredSecondary.map((item) => {
                  const id = getSecondaryId(item);
                  const isSelected = selectedSecondary.some(
                    (el) => getSecondaryId(el) === id
                  );
                  return (
                    <motion.div
                      key={id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card
                        className={`cursor-pointer transition-all duration-200 hover:shadow-md `}
                        onClick={() => toggleSecondary(item)}
                      >
                        <CardContent className="p-4">
                          {renderSecondaryItem(item, isSelected)}
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </ScrollArea>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleOnClose}>
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedPrimary || selectedSecondary.length === 0}
            >
              <Plus className="w-4 h-4 mr-2" />
              Asignar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
