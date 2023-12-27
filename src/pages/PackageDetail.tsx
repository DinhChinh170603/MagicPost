import { LoadingOutlined, SearchOutlined } from "@ant-design/icons";
import { Form, Input, Skeleton, Timeline } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import service from "../helpers/service";
import { toast } from "react-toastify";
import {
  IN_PROGRESS_STATE,
  REJECTED_STATE,
  REJECTED_STATUS_PREFIX,
  SUCCESS_STATE,
} from "../helpers/constants";
import moment from "moment";

function PackageDetail() {
  const { state } = useLocation();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  const pathParams = useParams();

  const [curPackage, setCurPackage] = useState(state);

  const [prevInput, setPrevInput] = React.useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (state) {
      return;
    }

    setCurPackage(null);

    service
      .get("/package/" + pathParams.id)
      .then((res) => {
        if (res.data.status === 200 && res.data.results) {
          setCurPackage(res.data.results);
        } else {
          toast.error("Không tìm thấy gói hàng");
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  }, []);

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
            setCurPackage(res.data.results);
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
    <div className="flex h-screen w-screen flex-col items-center bg-[#f1f5f9]">
      <div className="flex h-full w-full flex-col items-center overflow-y-auto">
        <div className="sticky top-0 z-10 flex w-full items-center bg-white px-3 shadow-md">
          <Form
            form={form}
            onFinish={search}
            className="flex w-full items-center max-lg:justify-between"
          >
            <div className="flex items-center">
              <img src="/src/assets/minilogo.svg" alt="logo" />
              <div className="text-3xl font-bold max-md:hidden">Magic Post</div>
            </div>
            <Form.Item
              name="packageId"
              className="w-[50%] lg:absolute lg:left-0 lg:right-0 lg:m-auto lg:w-[40%] m-0"
            >
              <Input
                placeholder="Mã đơn hàng"
                className="px-3 py-2 text-xl max-md:px-2 max-md:py-1 max-md:text-lg"
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
                      setPrevInput(
                        e.target.value.toUpperCase().substring(0, 3),
                      );
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
                      setPrevInput(
                        e.target.value.toUpperCase().substring(0, 8),
                      );
                    } else {
                      form.setFieldValue(
                        "packageId",
                        (e.target.value + "_").toUpperCase(),
                      );
                      setPrevInput(e.target.value.toUpperCase() + "_");
                    }
                  } else {
                    form.setFieldValue(
                      "packageId",
                      e.target.value.toUpperCase(),
                    );
                    setPrevInput(e.target.value.toUpperCase());
                  }
                }}
                maxLength={14}
              />
            </Form.Item>
          </Form>
        </div>
        {!curPackage ? (
          <div className="mt-3 flex w-[80%] justify-evenly gap-5 rounded-lg border border-gray-300 bg-white px-6 py-3 shadow-md max-lg:flex-col">
            <Skeleton active />
            <Skeleton active />
            <Skeleton active />
          </div>
        ) : (
          <div className="mt-3 flex w-[80%] justify-evenly rounded-lg border border-gray-300 bg-white shadow-md max-lg:flex-col max-md:gap-3 lg:py-3">
            <div className="basis-[30%]">
              <div className="border border-gray-200 bg-[#eeeeee] p-3 font-bold lg:rounded-lg">
                THÔNG TIN ĐƠN HÀNG
              </div>
              <div className="px-3">
                <table>
                  <tbody>
                    <tr>
                      <td className="whitespace-nowrap py-2 pr-3">
                        Mã đơn hàng:{" "}
                      </td>
                      <td className="font-semibold">{curPackage.id}</td>
                    </tr>
                    <tr>
                      <td className="whitespace-nowrap py-2 pr-3">
                        Ngày gửi:{" "}
                      </td>
                      <td className="font-semibold">
                        {moment(curPackage.sentAt).format("DD-MM-YYYY")}
                      </td>
                    </tr>
                    <tr>
                      <td className="whitespace-nowrap py-2 pr-3">
                        Loại hàng:{" "}
                      </td>
                      <td className="font-semibold">
                        {curPackage.packageType === "GOODS"
                          ? "Hàng hóa"
                          : "Tài liệu"}
                      </td>
                    </tr>
                    <tr>
                      <td className="whitespace-nowrap py-2 pr-3">
                        Tình trạng:{" "}
                      </td>
                      <td className="font-semibold">
                        {curPackage.generalState === SUCCESS_STATE ? (
                          <div className="rounded-lg bg-[#9bd1f5] px-2 py-1 text-center">
                            Hoàn thành
                          </div>
                        ) : curPackage.generalState === REJECTED_STATE ? (
                          <div className="rounded-lg bg-[#f5a9a9] px-2 py-1 text-center">
                            Thất bại
                          </div>
                        ) : (
                          <div className="rounded-lg bg-[#ffe6ab] px-2 py-1 text-center">
                            Đang vận chuyển
                          </div>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="basis-[30%]">
              <div className="border border-gray-200 bg-[#eeeeee] p-3 font-bold lg:rounded-lg">
                NGƯỜI GỬI
              </div>
              <div className="px-3">
                <table>
                  <tbody>
                    <tr>
                      <td className="whitespace-nowrap py-2 pr-3">
                        Họ và tên:
                      </td>
                      <td className="font-semibold">{curPackage.senderName}</td>
                    </tr>
                    <tr>
                      <td className="whitespace-nowrap py-2 pr-3">
                        Điện thoại:
                      </td>
                      <td className="font-semibold">
                        {curPackage.senderContact}
                      </td>
                    </tr>
                    <tr>
                      <td className="whitespace-nowrap py-2 pr-3">
                        Địa chỉ gửi:
                      </td>
                      <td className="font-semibold">{curPackage.orgAddress}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="basis-[30%]">
              <div className="border border-gray-200 bg-[#eeeeee] p-3 font-bold lg:rounded-lg">
                NGƯỜI NHẬN
              </div>
              <div className="px-3">
                <table>
                  <tbody>
                    <tr>
                      <td className="whitespace-nowrap py-2 pr-3">
                        Họ và tên:
                      </td>
                      <td className="font-semibold">
                        {curPackage.receiverName}
                      </td>
                    </tr>
                    <tr>
                      <td className="whitespace-nowrap py-2 pr-3">
                        Điện thoại:
                      </td>
                      <td className="font-semibold">
                        {curPackage.receiverContact}
                      </td>
                    </tr>
                    <tr>
                      <td className="whitespace-nowrap py-2 pr-3">
                        Địa chỉ nhận:
                      </td>
                      <td className="font-semibold">{curPackage.desAddress}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        <div className="mt-3 text-3xl font-bold">Trạng thái đơn hàng</div>
        <div className="mt-3 flex items-center rounded-lg border border-gray-300 bg-white p-10 shadow-md max-lg:w-[95%]">
          {curPackage ? (
            <Timeline
              mode="left"
              items={curPackage.status.map((item: any, index: number) => {
                return {
                  color:
                    index === curPackage.status.length - 1
                      ? curPackage.generalState === SUCCESS_STATE
                        ? "green"
                        : item.detail.startsWith(REJECTED_STATUS_PREFIX)
                          ? "red"
                          : "blue"
                      : "blue",
                  children: (
                    <div className="flex gap-3 max-md:flex-col max-md:gap-1">
                      <span
                        className={
                          index === curPackage.status.length - 1
                            ? curPackage.generalState === SUCCESS_STATE
                              ? "whitespace-nowrap font-semibold text-[#52c41a]"
                              : item.detail.startsWith(REJECTED_STATUS_PREFIX)
                                ? "whitespace-nowrap font-semibold text-[#ff4d4f]"
                                : "whitespace-nowrap font-semibold text-[#3C50E0]"
                            : "whitespace-nowrap font-semibold text-[#3C50E0]"
                        }
                      >
                        {moment(item.timestamp).format("DD/MM - hh:mm")}
                      </span>
                      <span>{item.detail}</span>
                    </div>
                  ),
                };
              })}
              className={
                "flex-1 " +
                (curPackage.generalState === IN_PROGRESS_STATE
                  ? "-mb-3"
                  : "-mb-16")
              }
              pending={curPackage.generalState === IN_PROGRESS_STATE}
            />
          ) : (
            <Skeleton
              active
              className="w-[700px] max-lg:w-[100%]"
              paragraph={{ rows: 5, width: "100%" }}
              title={false}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default PackageDetail;
