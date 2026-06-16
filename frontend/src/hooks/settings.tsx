import React, { useEffect, useRef, useState } from "react"
import useAxios from "../lib/axios.service";
import { toast } from "sonner";
import type { Device, Notification } from "../lib/types";
import { useAuthStore } from "../lib/store/authStore";
import { useQuery } from "@tanstack/react-query";
import useSocket from "../lib/socket";


export default function useSetting() {
    const { axiosPrivate } = useAxios();
    const { socket} = useSocket();
    const { user, setUser } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        instanceName: ""
    });
    const [laodingUpload, setLoadingUpload] = useState(false);
    const [loadingUser, setLoadingUser] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenQrCode, setIsOpenQrCode] = useState(false);
    const [selectDevice, setSelectDevice] = useState<Device | null>(null);
    const [devices, setDevices] = useState<Device[]>([]);
    const [showImage, setShowImage] = useState<string | null>(null);
    const [formDataUser, setFormDataUser] = useState({
        username: "",
        email: "",
        name: ""
    });
    const [formDataPassword, setFormDataPassword] = useState({
        password: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [image, setImage] = useState<File | null>(null);
    const refInputImages = useRef<HTMLInputElement | null>(null);

    const fetchDevices = async () => {
        setLoading(true);
        try {
            const res = await axiosPrivate.get("/devices");
            const data = res.data;
            console.log(data);
            setDevices(data);
        } catch (err: any) {
            if (err.response?.status === 404) {
                toast.error("Evolution API tidak aktif (404). Mengirim pesan peringatan...", {
                    icon: '📡',
                    style: {
                        borderRadius: '12px',
                        background: '#991b1b',
                        color: '#fff',
                    },
                });

            } else {
                const errorMessage = err.response?.data?.message || "Gagal mengambil data devices";
                toast.error(errorMessage, {
                    duration: 4000,
                    position: 'top-right',
                    style: {
                        borderRadius: '12px',
                        background: '#1e293b',
                        color: '#fff',
                    },
                });
            }

            console.error("Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await axiosPrivate.post("/devices", formData);
            const data = res.data;
            setDevices(prev => [data, ...prev]);
            toast.success("Device berhasil ditambahkan");
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Gagal membuat device";
            toast.error(errorMessage, {
                duration: 4000,
                position: 'top-right',
                style: {
                    borderRadius: '12px',
                    background: '#1e293b',
                    color: '#fff',
                },
            });

            console.error("Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    }


    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this device?")) {
            try {
                const res = await axiosPrivate.delete(`/devices/${id}`);
                const data = res.data;
                setDevices(prev => prev.filter(p => p.id !== id));
                toast.success(data.message || `Delete ${id} successfully`);
            } catch (err: any) {
                const errorMessage = err.response?.data?.message || "Gagal hapus data device";
                toast.error(errorMessage, {
                    duration: 4000,
                    position: 'top-right',
                    style: {
                        borderRadius: '12px',
                        background: '#1e293b',
                        color: '#fff',
                    },
                });

                console.error("Fetch Error:", err);
            }
        }
    };

    const handleUpdateUser = async () => {
        if (!user) return;
        setLoadingUser(true);
        try {
            const dataToSend = {};
            Object.entries(formDataUser).forEach(([key, val]) => {
                if (val !== (user as any)[key]) {
                    (dataToSend as any)[key] = val;
                }
            });
            if (Object.entries(dataToSend).length === 0) return;
            const res = await axiosPrivate.patch("/users", dataToSend);
            const data = res.data;
            setUser({
                name: data.name,
                username: data.username,
                email: data.email,
                role: data.role,
                id: data.id,
                profileUrl: data.profileUrl
            });
            console.log(data);
            toast.success("Update user Berhasil");
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Gagal membuat device";
            toast.error(errorMessage, {
                duration: 4000,
                position: 'top-right',
                style: {
                    borderRadius: '12px',
                    background: '#1e293b',
                    color: '#fff',
                },
            });

            console.error("Fetch Error:", err);
        } finally {
            setLoadingUser(false);
        }
    }

    const handleClose = () => {
        setIsOpen(false);
        setIsOpenQrCode(false);
    }

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (formDataPassword.confirmPassword !== formDataPassword.newPassword) {
            newErrors.password = "Konfirmasi password tidak sama!";
        }

        setErrors(newErrors);
        console.log(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleUpdatePassword = async () => {
        if (!validate()) return;
        try {
            const dataToSend = {
                password: formDataPassword.password,
                newPassword: formDataPassword.newPassword
            }
            const res = await axiosPrivate.post("/users/reset-password", dataToSend);
            const data = res.data;
            console.log(data);
            toast.success("Update Password Successfully");
            setFormDataPassword({
                password: "",
                newPassword: "",
                confirmPassword: ""
            })
        } catch (err: any) {
            const errorMessages = err.response?.data?.message;
            let errorMessage = "Gagal update Password";
            if (Array.isArray(errorMessages)) {
                setErrors({
                    password: errorMessages[0]
                });
                errorMessage = errorMessages[0];
            }
            toast.error(errorMessage, {
                duration: 4000,
                position: 'top-right',
                style: {
                    borderRadius: '12px',
                    background: '#1e293b',
                    color: '#fff',
                },
            });

            console.error("Fetch Error:", err);
        } finally {
            setLoadingUser(false);
        }
    }
    const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const maxSize = 2 * 1024 * 1024;

        if (file.size > maxSize) {
            toast.warning("Ukuran file terlalu besar! Maksimal adalah 2MB.");
            e.target.value = "";
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
            toast.error("Format file tidak didukung. Gunakan JPEG, PNG, atau WebP.");
            e.target.value = "";
            return;
        }
        const imageUrl = URL.createObjectURL(file);
        setShowImage(imageUrl);
        setImage(file);

    };
    const handleUpload = async () => {
        if (!image) return;
        if (!confirm("Apakah anda yakin ingin mengganti profile?")) return;
        setLoadingUpload(true);
        try {
            const dataToSend = new FormData();
            dataToSend.append("file", image);
            const res = await axiosPrivate.post("/users/upload", dataToSend);
            const data = res.data;
            setUser({
                name: data.name,
                username: data.username,
                email: data.email,
                role: data.role,
                id: data.id,
                profileUrl: data.profileUrl
            });
            console.log(data);
            toast.success("Update profile Berhasil");
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Gagal update profile";
            toast.error(errorMessage, {
                duration: 4000,
                position: 'top-right',
                style: {
                    borderRadius: '12px',
                    background: '#1e293b',
                    color: '#fff',
                },
            });

            console.error("Fetch Error:", err);
        } finally {
            setLoadingUpload(false);
        }
    }
    const fetchNotifications = async () => {
        try {
            const res = await axiosPrivate.get(`/notifications?limit=3`);
            const data: Notification[] = res.data;
            console.log("Fetched Notifications:", data);
            return data;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Gagal mengambil data notification";
            toast.error(errorMessage, {
                duration: 4000,
                position: 'top-right',
                style: {
                    borderRadius: '12px',
                    background: '#1e293b',
                    color: '#fff',
                },
            });

            console.error("Fetch Error:", err);
        }
    }
    const handleSelectDevice = (device: Device) => {
        setIsOpenQrCode(true);
        setSelectDevice(device);
    }
    const { data: notifications, isLoading: isLoadingNotifications } = useQuery({
        queryKey: ["notifications"],
        queryFn: fetchNotifications,
        staleTime: 5 * 60 * 1000,
    });

    useEffect(() => {
        if (user) {
            setFormDataUser({
                username: user.username,
                name: user.name,
                email: user.email
            })
        }
        fetchDevices();

        socket.on("update_connection_whatsapp", ({ status, instanceName, phoneNumber }) => {
            console.log("data: ", {
                instanceName,
                status,
                phoneNumber
            })
            if (status === "open") {
                handleClose();
            }
            setDevices(prev => prev.map((p) => p.instanceName === instanceName ? ({
                ...p,
                status: status === "open" ? "connected" : "disconnected",
                number: phoneNumber
            }): p));
        })
    }, [])

    return {
        fetchDevices,
        loading,
        handleSubmit,
        handleDelete,
        devices,
        handleClose,
        isOpen,
        setIsOpen,
        setFormData,
        formData,
        handleUpdateUser,
        user,
        setFormDataUser,
        formDataUser,
        setLoadingUser,
        loadingUser,
        handleUpdatePassword,
        formDataPassword,
        setFormDataPassword,
        errors,
        isOpenQrCode,
        setIsOpenQrCode,
        setSelectDevice,
        selectDevice,
        handleSelectDevice,
        refInputImages,
        handleChangeImage,
        showImage,
        laodingUpload,
        handleUpload,
        notifications,
        isLoadingNotifications
    }
}