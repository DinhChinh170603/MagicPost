import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
  Avatar,
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Skeleton,
} from "antd";
import axios from "axios";
import dayjs from "dayjs";
import moment from "moment";
import { useContext, useEffect, useRef, useState } from "react";
import { AiOutlineCamera } from "react-icons/ai";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ChangePasswordModal from "../components/ChangePasswordModal";
import AuthContext from "../contexts/AuthContext";
import {
  EE_ROLE,
  EM_ROLE,
  FIELD_REQUIRED,
  GE_ROLE,
  GM_ROLE,
  LEADER_ROLE,
} from "../helpers/constants";
import service from "../helpers/service";

const { Option } = Select;

export default function User() {
  const [loading, setLoading] = useState(false);

  const pathParams = useParams();

  const [form] = Form.useForm();
  const { user, setUser } = useContext<any>(AuthContext);

  const [profileUser, setProfileUser] = useState<any>({});

  const [avatarLink, setAvatarLink] = useState<any>();
  const [avatarEditLoading, setAvatarEditLoading] = useState(false);

  const imageInputRef = useRef(null);

  const [exchangePointsList, setExchangePointsList] = useState(null);
  const [gatherPointsList, setGatherPointsList] = useState(null);

  const [roleDepartmentList, setRoleDepartmentList] = useState<any>([]);
  const [departmentLoading, setDepartmentLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);

  const [editLoading, setEditLoading] = useState(false);

  const handleRoleSelection = (value: string) => {
    if (!gatherPointsList || !exchangePointsList) {
      return;
    }

    switch (value) {
      case "GATHER_MANAGER" || "GATHER_EMPLOYEE":
        setRoleDepartmentList(gatherPointsList);
        break;
      case "EXCHANGE_MANAGER" || "EXCHANGE_EMPLOYEE":
        setRoleDepartmentList(exchangePointsList);
        break;
      default:
        break;
    }
    form.setFieldValue("departmentId", undefined);
  };

  useEffect(() => {
    if (!gatherPointsList || !exchangePointsList) {
      return;
    }
    handleRoleSelection(form.getFieldValue("role"));
    form.setFieldValue("departmentId", profileUser?.departmentId);
  }, [gatherPointsList, exchangePointsList]);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    service
      .get("/users/" + pathParams.id)
      .then((res) => {
        if (res.data.status === 200) {
          setProfileUser(res.data.results);
          setAvatarLink(res.data.results?.avatar);

          form.setFieldsValue({
            ...res.data.results,
            dob: dayjs(res.data.results.dob),
            startWorkingDate: moment(res.data.results.startWorkingDate).format(
              "DD/MM/YYYY",
            ),
          });
          if (user.role === LEADER_ROLE && profileUser.role !== LEADER_ROLE) {
            setDepartmentLoading(true);
            axios
              .all([
                service.get("/leader/exchange-points"),
                service.get("/leader/gather-points"),
              ])
              .then(
                axios.spread((res1, res2) => {
                  setExchangePointsList(res1.data.results);
                  setGatherPointsList(res2.data.results);
                  setDepartmentLoading(false);
                }),
                () => {
                  setDepartmentLoading(false);
                  toast.error("Something went wrong");
                },
              )
              .catch((err) => {
                setDepartmentLoading(false);
                toast.error(err.response.data.message);
              });
          }
        }

        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response);
      });
  }, [user]);

  const onFinish = () => {
    setEditLoading(true);
    const { fullName, role, departmentId, dob } = form.getFieldsValue();
    service
      .patch("/leader/user", {
        id: profileUser.id,
        fullName,
        role,
        departmentId,
        dob,
      })
      .then((res) => {
        if (res.data.status === 200) {
          toast.success(res.data.message);
          setEditLoading(false);
          setProfileUser(res.data.results);
        } else {
          toast.error(res.data.message);
          setEditLoading(false);
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        setEditLoading(false);
      });
  };

  const submitEditAvatar = () => {
    setAvatarEditLoading(true);
    const formData = new FormData();
    formData.append("image", imageInputRef.current.files[0]);
    service
      .patch("/avatar", formData)
      .then((res) => {
        if (res.data.status === 200) {
          toast.success(res.data.message);
          setUser({
            ...user,
            avatar: res.data.results,
          });
          setAvatarLink(res.data.results);
          setAvatarEditLoading(false);
        } else {
          toast.error(res.data.message);
          setAvatarEditLoading(false);
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        setAvatarEditLoading(false);
      });
  };

  return (
    <div className="pb-4">
      <div className="mb-4 ml-3 text-3xl font-bold">Profile</div>
      <div className="flex justify-center">
        <div className="flex w-[90%] justify-center gap-7 max-md:flex-col">
          <div className="flex flex-1 flex-col items-center rounded-md bg-white p-4 shadow-md border border-gray-300 h-fit pb-7">
            <span className="text-center text-lg text-bold"> Avatar </span>
            <hr className="w-[80%] mt-1 mb-3" style={{borderWidth: 1}} />
            <div className="flex">
              {loading ? (
                <Skeleton.Avatar size={130} active />
              ) : (
                <label className="relative" htmlFor="avatar">
                  <div className="relative">
                    {avatarLink ? (
                      <Avatar
                        src={avatarLink}
                        size={130}
                        className="cursor-pointer shadow-lg"
                      />
                    ) : (
                      <AccountCircleIcon
                        className="cursor-pointer"
                        sx={{ color: "black", fontSize: 130 }}
                      />
                    )}
                    {profileUser?.id === user?.id && (
                      <div className="absolute right-0 top-1 cursor-pointer rounded-full border border-gray-500 bg-white p-1 transition-all duration-100 hover:bg-gray-200">
                        <AiOutlineCamera size={20} />
                      </div>
                    )}
                  </div>
                </label>
              )}
              <input
                disabled={profileUser?.id !== user?.id}
                ref={imageInputRef}
                accept="image/*"
                id="avatar"
                type="file"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) {
                    setAvatarLink(URL.createObjectURL(e.target.files[0]));
                  }
                }}
              />
            </div>
            <div className="mt-3 text-2xl font-bold">
              <Skeleton
                loading={loading}
                paragraph={false}
                style={{ width: 200 }}
                className="mt-3"
                active
              >
                {profileUser.fullName}
              </Skeleton>
            </div>
            <div className="text-gray-500">
              <Skeleton
                loading={loading}
                paragraph={false}
                style={{ width: 200 }}
                className="mt-3"
                active
              >
                {profileUser.role}
              </Skeleton>
            </div>
            {profileUser?.id === user?.id && (
              <Button className="mt-3" onClick={() => setModalOpen(true)}>
                Change password
              </Button>
            )}
            {avatarLink && avatarLink !== profileUser.avatar && (
              <div className="flex">
                <Button
                  type="primary"
                  onClick={submitEditAvatar}
                  loading={avatarEditLoading}
                  className="mt-3"
                >
                  Save
                </Button>
                <Button
                  onClick={() => {
                    setAvatarLink(profileUser.avatar);
                    imageInputRef.current.value = "";
                  }}
                  className="mt-3"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>

          <div className="flex-[2] rounded-md bg-white p-4 shadow-md border border-gray-300">
            <div className="flex items-center justify-center flex-col">
              <span className="text-center text-lg">Information</span>
              <hr className="w-[80%] mt-1 mb-3" style={{ borderWidth: 1 }} />
            </div>
          
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: FIELD_REQUIRED },
                  { type: "email", message: "Invalid email address" },
                ]}
              >
                <Input disabled={!user || user.role !== LEADER_ROLE}/>
              </Form.Item>
              <Form.Item
                name="fullName"
                label="Full Name"
                rules={[{ required: true, message: FIELD_REQUIRED }]}
              >
                <Input disabled={!user || user.role !== LEADER_ROLE} />
              </Form.Item>
              <div className="flex gap-3 max-md:flex-col">
                <Form.Item
                  name="role"
                  label="Role"
                  rules={[{ required: true, message: FIELD_REQUIRED }]}
                  className="flex-1"
                >
                  <Select
                    disabled={!user || user.role !== LEADER_ROLE}
                    onChange={handleRoleSelection}
                  >
                    <Option value={GM_ROLE}>Gather Manager</Option>
                    <Option value={GE_ROLE}>Gather Employee</Option>
                    <Option value={EM_ROLE}>Exchange Manager</Option>
                    <Option value={EE_ROLE}>Exchange Employee</Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name="departmentId"
                  label="Department"
                  rules={
                    profileUser.role === LEADER_ROLE
                      ? []
                      : [{ required: true, message: FIELD_REQUIRED }]
                  }
                  className="flex-1"
                >
                  <Select
                    disabled={
                      !user ||
                      user.role !== LEADER_ROLE ||
                      !form.getFieldValue("role") ||
                      profileUser.role === LEADER_ROLE ||
                      departmentLoading
                    }
                    loading={departmentLoading}
                    onClick={() => console.log(roleDepartmentList)}
                  >
                    {roleDepartmentList.map((d: any) => (
                      <Select.Option key={d.id} value={d.id}>
                        {d.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <Form.Item
                name="dob"
                label="Date of Birth"
                rules={[{ required: true, message: FIELD_REQUIRED }]}
              >
                <DatePicker
                  className="w-64"
                  format="DD/MM/YYYY"
                  disabledDate={(current) =>
                    current && current.valueOf() > Date.now()
                  }
                  disabled={!user || user.role !== LEADER_ROLE}
                />
              </Form.Item>
              <Form.Item name="startWorkingDate" label="Start Working">
                <Input disabled />
              </Form.Item>
              {user?.role === LEADER_ROLE && (
                <Form.Item className="flex items-center justify-center">
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={editLoading}
                    className="mt-3"
                  >
                    Save user info
                  </Button>
                </Form.Item>
              )}
            </Form>
          </div>
        </div>
      </div>
      <ChangePasswordModal open={modalOpen} setOpen={setModalOpen} />
    </div>
  );
}
