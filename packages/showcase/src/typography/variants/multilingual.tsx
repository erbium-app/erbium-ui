import { Button } from "@erbium/ui/components/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@erbium/ui/components/card";
import { Field, FieldLabel } from "@erbium/ui/components/field";
import { Input } from "@erbium/ui/components/input";

const MultilingualExample = () => (
  <div className="grid w-full gap-group lg:grid-cols-2">
    <Card dir="rtl" lang="fa">
      <CardHeader>
        <CardTitle>تنظیمات فضای کاری</CardTitle>
        <CardDescription>متن فارسی با فونت وزیرمتن نمایش داده می‌شود.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-related">
        <Field>
          <FieldLabel htmlFor="typography-persian">نام فضای کاری</FieldLabel>
          <Input id="typography-persian" defaultValue="استودیوی اربیوم" />
        </Field>
        <p className="text-body">فضای کاری Erbium برای همکاری تیم شما.</p>
      </CardContent>
      <CardFooter>
        <Button>ذخیره تنظیمات</Button>
      </CardFooter>
    </Card>
    <Card dir="rtl" lang="ar">
      <CardHeader>
        <CardTitle>إعدادات مساحة العمل</CardTitle>
        <CardDescription>النص العربي يستخدم نفس الأدوار الطباعية.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-related">
        <Field>
          <FieldLabel htmlFor="typography-arabic">اسم مساحة العمل</FieldLabel>
          <Input id="typography-arabic" defaultValue="استوديو إربيوم" />
        </Field>
        <p className="text-body">مساحة عمل Erbium لفريقك.</p>
      </CardContent>
      <CardFooter>
        <Button>حفظ الإعدادات</Button>
      </CardFooter>
    </Card>
  </div>
);

export default MultilingualExample;
