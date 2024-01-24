import { Card, Text } from "@mantine/core";

interface CustomCardInterface {
  title: string;
  value: any;
}

export const CustomCard = ({ title, value }: CustomCardInterface) => {
  return (
    <Card
      shadow="sm" padding="md" radius="sm"
      w={240}
      h={140}
    >
      <Text
        size="xl"
        fw="bold"
      >
        {title}
      </Text>
      <Text
        size="xl"
        fw="bold"
        c={ value >= 0 ? "blue" : "red" }
      >
        {
          Math.abs(value).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          })
        }
      </Text>
    </Card>
  );
}
