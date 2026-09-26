// @ts-nocheck
import { SearchIcon } from "lucide-react";

import { Button } from "../components/button";
import { ButtonGroup } from "../components/button-group";
import { Input } from "../components/input";

export default function ButtonGroupInput() {
  return (
    <ButtonGroup>
      <Input placeholder="Search..." />
      <Button variant="outline" aria-label="Search">
        <SearchIcon />
      </Button>
    </ButtonGroup>
  );
}
