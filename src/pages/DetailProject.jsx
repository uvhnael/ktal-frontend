import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  ArrowLeft,
  Loader,
  Clock,
  User,
  FileText,
  Building,
  Ruler,
  Share2,
} from "lucide-react";
import { projectAPI } from "../services/api";
import { useApi } from "../hooks/useApi";
import { sanitizeHTML, formatDate, getStatusInfo } from "../utils/htmlUtils";

const DetailProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Use custom hook for fetching project details
  const {
    data: project,
    loading,
    error,
    refetch,
  } = useApi(() => projectAPI.getById(id), [id]);

  console.log("Project data:", project);
  // Update document title
  useEffect(() => {
    if (project) {
      document.title = `${project.title} - Kiến trúc An Lạc`;
    }
    return () => {
      document.title = "Kiến trúc An Lạc";
    };
  }, [project]);

  // Share functionality
  const handleShare = () => {
    if (navigator.share && project) {
      navigator
        .share({
          title: project.title,
          text: `Xem dự án ${project.title} tại Kiến trúc An Lạc`,
          url: window.location.href,
        })
        .catch(console.error);
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => {
          alert("Đã sao chép link dự án!");
        })
        .catch(() => {
          alert("Không thể sao chép link. Vui lòng thử lại.");
        });
    }
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="flex items-center">
          <Loader className="animate-spin mr-2" size={24} />
          <span>Đang tải thông tin dự án...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <div className="space-x-4">
            <button
              onClick={refetch}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Thử lại
            </button>
            <button
              onClick={() => navigate("/portfolio")}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Quay lại danh sách
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Không tìm thấy dự án.</p>
          <button
            onClick={() => navigate("/portfolio")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(project.status);

  return (
    <div className="pt-20">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="text-sm mb-6">
            <ol className="flex items-center space-x-2 text-blue-100">
              <li>
                <button
                  onClick={() => navigate("/")}
                  className="hover:text-white transition-colors"
                >
                  Trang chủ
                </button>
              </li>
              <li>/</li>
              <li>
                <button
                  onClick={() => navigate("/portfolio")}
                  className="hover:text-white transition-colors"
                >
                  Dự án
                </button>
              </li>
              <li>/</li>
              <li className="text-white font-medium truncate max-w-xs">
                {project.title}
              </li>
            </ol>
          </nav>

          <button
            onClick={() => navigate("/portfolio")}
            className="flex items-center text-blue-100 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Quay lại danh sách dự án
          </button>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="lg:w-2/3">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {project.title}
              </h1>

              {project.description && (
                <p className="text-lg text-blue-100 mb-4">
                  {project.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-blue-100">
                {project.year && (
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2" />
                    <span>Năm {project.year}</span>
                  </div>
                )}
                {project.area && (
                  <div className="flex items-center">
                    <Ruler size={16} className="mr-2" />
                    <span>{project.area}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <span
                    className={`inline-block w-2 h-2 rounded-full mr-2 ${statusInfo.color}`}
                  ></span>
                  <span>{statusInfo.text}</span>
                </div>
              </div>
            </div>{" "}
            <div className="mt-6 lg:mt-0 lg:w-1/3 lg:text-right">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm text-blue-100 mb-1">Mã dự án</p>
                    <p className="text-lg font-semibold">#{project.id}</p>
                  </div>
                  <button
                    onClick={handleShare}
                    className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
                    title="Chia sẻ dự án"
                  >
                    <Share2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Project Details */}
            <div className="lg:col-span-2">
              {/* Project Images */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">{project.title}</h2>
                <div className="w-full">
                  {project.thumbnail ? (
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="h-auto w-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500">Hình ảnh chính</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Project Description */}
              {project.content && (
                <div className="mb-8">
                  <div
                    className="prose max-w-none text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={sanitizeHTML(project.content)}
                  />
                </div>
              )}

              {/* Project Timeline */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Thông tin thời gian</h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Clock size={20} className="text-blue-600 mr-3" />
                      <div>
                        <p className="font-medium text-gray-700">Ngày tạo</p>
                        <p className="text-gray-600">
                          {formatDate(project.createdAt)}
                        </p>
                      </div>
                    </div>
                    {project.updatedAt && (
                      <div className="flex items-center">
                        <FileText size={20} className="text-green-600 mr-3" />
                        <div>
                          <p className="font-medium text-gray-700">
                            Cập nhật lần cuối
                          </p>
                          <p className="text-gray-600">
                            {formatDate(project.updatedAt)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Project Info Card */}
              <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold mb-4">Thông tin dự án</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Building size={20} className="text-blue-600 mr-3 mt-1" />
                    <div>
                      <p className="font-medium text-gray-700">Tên dự án</p>
                      <p className="text-gray-600">{project.title}</p>
                    </div>
                  </div>

                  {project.year && (
                    <div className="flex items-start">
                      <Calendar size={20} className="text-blue-600 mr-3 mt-1" />
                      <div>
                        <p className="font-medium text-gray-700">
                          Năm thực hiện
                        </p>
                        <p className="text-gray-600">{project.year}</p>
                      </div>
                    </div>
                  )}

                  {project.area && (
                    <div className="flex items-start">
                      <Ruler size={20} className="text-blue-600 mr-3 mt-1" />
                      <div>
                        <p className="font-medium text-gray-700">Khu vực</p>
                        <p className="text-gray-600">{project.area}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start">
                    <User size={20} className="text-blue-600 mr-3 mt-1" />
                    <div>
                      <p className="font-medium text-gray-700">Trạng thái</p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusInfo.textColor} bg-gray-100`}
                      >
                        {statusInfo.text}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact CTA */}
              <div className="bg-blue-600 text-white rounded-lg p-6">
                <h3 className="text-xl font-bold mb-3">
                  Quan tâm đến dự án này?
                </h3>
                <p className="mb-4 text-blue-100">
                  Liên hệ với chúng tôi để được tư vấn về dự án tương tự
                </p>
                <button
                  onClick={() => navigate("/contact")}
                  className="w-full bg-white text-blue-600 py-2 px-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  Liên hệ ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DetailProject;
