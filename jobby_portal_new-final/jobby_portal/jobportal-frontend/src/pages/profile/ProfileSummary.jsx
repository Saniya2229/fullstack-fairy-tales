import React from "react";
import { FiEdit2, FiDownload, FiMapPin, FiMail, FiPhone, FiCamera } from "react-icons/fi";

export default function ProfileSummary({ user, onEdit }) {
    if (!user) return null;

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Purple Gradient Banner */}
                <div className="h-28 bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-500 rounded-t-2xl"></div>

                <div className="px-8 pb-8">
                    <div className="relative -mt-14 flex flex-col md:flex-row md:items-end gap-6">
                        {/* Profile Photo */}
                        <div className="relative group">
                            <div className="w-28 h-28 rounded-full border-4 border-white bg-gradient-to-br from-purple-500 to-indigo-600 shadow-xl flex items-center justify-center overflow-hidden">
                                {user.profilePhoto ? (
                                    <img src={user.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-4xl font-bold text-white">
                                        {user.firstName?.[0]?.toUpperCase() || "U"}
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={() => document.getElementById('profile-photo-upload')?.click()}
                                className="absolute bottom-1 right-1 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white border-2 border-white hover:bg-purple-700 transition shadow-md"
                            >
                                <FiCamera className="w-4 h-4" />
                            </button>
                            <input
                                id="profile-photo-upload"
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                    const file = e.target.files[0];
                                    if (!file) return;
                                    try {
                                        const formData = new FormData();
                                        formData.append('file', file);
                                        const { default: api } = await import('../../api/api');
                                        const uploadRes = await api.post('/upload/profile-photo', formData, {
                                            headers: { 'Content-Type': 'multipart/form-data' }
                                        });
                                        await api.put('/users/me', { profilePhoto: uploadRes.data.url });
                                        window.location.reload();
                                    } catch (err) {
                                        console.error('Failed to upload photo:', err);
                                    }
                                }}
                                className="hidden"
                            />
                        </div>

                        {/* Name & Title */}
                        <div className="flex-1 pt-2">
                            <h1 className="text-2xl font-bold text-gray-900">
                                {user.firstName} {user.lastName}
                            </h1>
                            <p className="text-gray-500 mt-1">
                                {user.currentEducation_degree || "Student"}
                                {user.currentEducation_college && (
                                    <span className="text-gray-400"> • {user.currentEducation_college}</span>
                                )}
                            </p>
                        </div>

                        {/* Edit Button */}
                        <button
                            onClick={onEdit}
                            className="flex items-center gap-2 px-5 py-2.5 border-2 border-purple-600 text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
                        >
                            <FiEdit2 className="w-4 h-4" /> Edit Profile
                        </button>
                    </div>

                    {/* Contact Info Row */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-100">
                        <ContactItem icon={FiMail} label="EMAIL" value={user.email} />
                        <ContactItem icon={FiPhone} label="PHONE" value={user.phone || "-"} />
                        <ContactItem icon={FiMapPin} label="LOCATION" value={`${user.city || "-"}, ${user.state || "-"}`} />
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Education & Experience */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Education */}
                    <Card title="Education">
                        <div className="space-y-5">
                            {user.currentEducation_degree && (
                                <TimelineItem
                                    title={user.currentEducation_degree}
                                    subtitle={user.currentEducation_college}
                                    meta={`Year: ${user.currentEducation_year || "-"}`}
                                    detail={`CGPA: ${user.currentEducation_cgpa || "-"}`}
                                    active
                                />
                            )}
                            {user.previousEducation_12_school && (
                                <TimelineItem
                                    title="Class 12th / Diploma"
                                    subtitle={user.previousEducation_12_school}
                                    detail={`Marks: ${user.previousEducation_12_marks || "-"}%`}
                                />
                            )}
                            {user.previousEducation_10_school && (
                                <TimelineItem
                                    title="Class 10th"
                                    subtitle={user.previousEducation_10_school}
                                    detail={`Marks: ${user.previousEducation_10_marks || "-"}%`}
                                />
                            )}
                            {!user.currentEducation_degree && !user.previousEducation_12_school && !user.previousEducation_10_school && (
                                <p className="text-gray-400 italic text-sm">No education details added.</p>
                            )}
                        </div>
                    </Card>

                    {/* Experience */}
                    <Card title="Experience">
                        {user.internships && user.internships.length > 0 ? (
                            <div className="space-y-5">
                                {user.internships.map((exp, i) => (
                                    <TimelineItem
                                        key={i}
                                        title={exp.role || "Role"}
                                        subtitle={exp.company || "Company"}
                                        meta={exp.duration}
                                        detail={exp.description}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 italic text-sm">No experience added.</p>
                        )}
                    </Card>
                </div>

                {/* Right Column - Documents & Personal */}
                <div className="space-y-6">
                    {/* Documents */}
                    <Card title="Documents">
                        {user.documents && user.documents.length > 0 ? (
                            <div className="space-y-3">
                                {user.documents.map((doc, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <span className="text-sm font-medium text-gray-700 truncate max-w-[160px]">
                                            {doc.name}
                                        </span>
                                        <a
                                            href={doc.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="w-8 h-8 flex items-center justify-center text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                                        >
                                            <FiDownload className="w-4 h-4" />
                                        </a>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 italic text-sm">No documents uploaded.</p>
                        )}
                    </Card>

                    {/* Personal Details */}
                    <Card title="Personal Details">
                        <div className="space-y-4">
                            <DetailRow label="GENDER" value={user.gender} />
                            <DetailRow label="DATE OF BIRTH" value={user.dob} />
                            <DetailRow label="PERMANENT ADDRESS" value={user.permanentAddress} />
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

// ===== Reusable Components =====

function ContactItem({ icon: Icon, label, value }) {
    return (
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <div className="text-xs text-gray-400 font-semibold tracking-wide">{label}</div>
                <div className="text-sm font-medium text-gray-700">{value}</div>
            </div>
        </div>
    );
}

function Card({ title, children }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-5">{title}</h3>
            {children}
        </div>
    );
}

function TimelineItem({ title, subtitle, meta, detail, active }) {
    return (
        <div className="flex gap-4">
            {/* Timeline Dot */}
            <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full mt-1.5 ${active ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
                <div className="w-0.5 flex-1 bg-gray-100 mt-2"></div>
            </div>
            {/* Content */}
            <div className="flex-1 pb-5">
                <h4 className="font-bold text-gray-900">{title}</h4>
                <p className="text-purple-600 text-sm font-medium">{subtitle}</p>
                {meta && <p className="text-xs text-gray-400 mt-1">{meta}</p>}
                {detail && <p className="text-sm text-gray-600 mt-1">{detail}</p>}
            </div>
        </div>
    );
}

function DetailRow({ label, value }) {
    return (
        <div>
            <div className="text-xs text-gray-400 font-semibold tracking-wide mb-1">{label}</div>
            <div className="text-sm font-medium text-gray-800">{value || "-"}</div>
        </div>
    );
}
