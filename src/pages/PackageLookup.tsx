import { LoadingOutlined, SearchOutlined } from "@ant-design/icons";
import { Form, Input } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import service from "../helpers/service";

export default function PackageLookup() {
  const [form] = Form.useForm();
  const [prevInput, setPrevInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const navigate = useNavigate();

  const search = () => {
    const { packageId } = form.getFieldsValue();
    if (packageId.length !== 14) {
      form.setFields([
        {
          name: "packageId",
          errors: ["Mã đơn hàng không hợp lệ"],
        },
      ]);
      return;
    }

    setLoading(true);
    service
      .get("/package/" + packageId)
      .then(
        (res) => {
          setLoading(false);
          if (res.data.status === 200 && res.data.results) {
            navigate("/package-detail/" + packageId, {
              state: res.data.results,
            });
          } else {
            form.setFields([
              {
                name: "packageId",
                errors: ["Không tìm thấy đơn hàng"],
              },
            ]);
          }
        },
        () => {
          setLoading(false);
          form.setFields([
            {
              name: "packageId",
              errors: ["Lấy thông tin gói hàng thất bại"],
            },
          ]);
        },
      )
      .catch((err) => {
        setLoading(false);
        form.setFields([
          {
            name: "packageId",
            errors: [err.response.data.message],
          },
        ]);
      });
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center gap-5 bg-[#f1f5f9] max-lg:flex-col" style = {{backgroundImage: "url('/src/assets/BG_lookup.png')", backgroundSize: 'cover'}}>
      <div className="flex flex-col items-center">
        <img
          src="/src/assets/logo_animate.gif"
          className="h-[30vh] object-cover animate-updown lg:h-[60vh]"
        />
        <h1 className="text-[80px] font-bold max-lg:-mt-5 max-lg:text-[50px]">
          Magic Post
        </h1>
      </div>

      <div className="flex w-[30%] flex-col items-center gap-3 max-lg:w-[90%]">
        <h2 className="text-3xl font-bold">Tra cứu đơn hàng</h2>
        <Form form={form} onFinish={search} className="w-full">
          <Form.Item name="packageId">
            <Input
              placeholder="Mã đơn hàng"
              className="p-3 text-xl"
              suffix={
                <div
                  className="cursor-pointer rounded-lg bg-gray-300 px-2 py-1 hover:text-blue-600"
                  onClick={search}
                >
                  {loading ? (
                    <LoadingOutlined className="transition-all duration-300" />
                  ) : (
                    <SearchOutlined className="transition-all duration-300" />
                  )}
                </div>
              }
              onChange={(e) => {
                form.setFields([
                  {
                    name: "packageId",
                    errors: [],
                  },
                ]);
                if (form.getFieldValue("packageId").length === 4) {
                  if (prevInput.length === 5) {
                    form.setFieldValue(
                      "packageId",
                      e.target.value.toUpperCase().substring(0, 3),
                    );
                    setPrevInput(e.target.value.toUpperCase().substring(0, 3));
                  } else {
                    form.setFieldValue(
                      "packageId",
                      (e.target.value + "_").toUpperCase(),
                    );
                    setPrevInput(e.target.value.toUpperCase() + "_");
                  }
                } else if (form.getFieldValue("packageId").length === 9) {
                  if (prevInput.length === 10) {
                    form.setFieldValue(
                      "packageId",
                      e.target.value.toUpperCase().substring(0, 8),
                    );
                    setPrevInput(e.target.value.toUpperCase().substring(0, 8));
                  } else {
                    form.setFieldValue(
                      "packageId",
                      (e.target.value + "_").toUpperCase(),
                    );
                    setPrevInput(e.target.value.toUpperCase() + "_");
                  }
                } else {
                  form.setFieldValue("packageId", e.target.value.toUpperCase());
                  setPrevInput(e.target.value.toUpperCase());
                }
              }}
              onPressEnter={search}
              maxLength={14}
            />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
