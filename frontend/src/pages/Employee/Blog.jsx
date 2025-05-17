import React from "react";
import DashbroardLayout from "../../components/layouts/DashbroardLayout";
import nammen from "../../assets/images/nammen.jpg";
import bia from "../../assets/images/bia.jpg";
import banhmi from "../../assets/images/banhmi.jpg";

const Blog = () => {
  return (
    <DashbroardLayout activeMenu="Bài viết">
      <div className="p-4 space-y-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold">
          Nấm men: Chức năng, quy trình nuôi cấy và ứng dụng trong công nghiệp
        </h1>

        <section className="flex flex-col md:flex-row gap-6 items-start">
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-3">Nấm men là gì?</h2>
            <p className="text-justify leading-relaxed">
              Men là các loài nấm đơn bào, với một số ít các loài thường được sử
              dụng để lên men bánh mì hay trong sản xuất các loại đồ uống chứa
              cồn, cũng như trong một số mẫu tế bào nhiên liệu đang thử nghiệm.
              Phần lớn các loại men thuộc về ngành Nấm túi (<em>Ascomycota</em>
              ), mặc dù có một số loài thuộc về ngành Nấm đảm (
              <em>Basidiomycota</em>). Một số ít các loài nấm, chẳng hạn như{" "}
              <em>Candida albicans</em>, có thể gây bệnh ở người (
              <em>Candidiasis</em>). Trên 1.000 loài men đã được miêu tả. Loài
              men được con người sử dụng phổ biến nhất là
              <em> Saccharomyces cerevisiae</em>, nó được dùng để sản xuất rượu
              vang, bánh mì và bia từ hàng nghìn năm trước.
            </p>
          </div>
          <figure className="w-full md:w-64 shrink-0">
            <img
              src={nammen}
              alt="Hình ảnh nấm men qua kính hiển vi"
              className="rounded shadow border"
            />
            <figcaption className="text-sm text-center text-gray-600 mt-2">
              Hình ảnh Nấm men qua kính hiển vi
            </figcaption>
          </figure>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Quy trình nuôi cấy nấm men</h2>
          <p className="text-justify">
            Quy trình nuôi cấy nấm men nhằm mục đích tăng sinh khối tế bào, được
            thực hiện qua các giai đoạn sau:
          </p>

          <ul className="list-disc pl-6 mt-3 space-y-2">
            <li>
              <strong>Chuẩn bị môi trường:</strong> bao gồm dung dịch chứa đường
              (saccharose), muối khoáng, nguồn nitơ,...
            </li>
            <li>
              <strong>Giai đoạn tiềm phát:</strong> nấm men thích nghi với môi
              trường, sản sinh acid amin và nucleic, cần cung cấp ~50 m³
              khí/giờ/m³.
            </li>
            <li>
              <strong>Giai đoạn tăng trưởng:</strong> nấm sinh sản mạnh, tổng
              hợp enzyme và RNA, nhu cầu oxy cao (~80–100 m³/giờ/m³).
            </li>
            <li>
              <strong>Giai đoạn cân bằng:</strong> tốc độ sinh ≈ chết, trao đổi
              chất giảm, giảm oxy xuống 20–50 m³/giờ/m³.
            </li>
            <li>
              <strong>Biến đổi đi kèm:</strong> nhiệt độ tăng, pH giảm do acid
              hữu cơ, tạo bọt, tiêu hao đường và oxy hòa tan.
            </li>
            <li>
              <strong>Giai đoạn lắng:</strong> hạ nhiệt còn 27°C, giảm khí còn
              40–60%, thời gian lắng 1.5–2 giờ.
            </li>
            <li>
              <strong>Thu nhận sinh khối:</strong> tách bọt, ly tâm, tuyển nổi.
              Dựa vào tỉ trọng tế bào (1.13–1.14) để tách hiệu quả khỏi dịch
              nuôi.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">
            Ứng dụng của nấm men trong công nghiệp
          </h2>

          <h3 className="text-lg font-medium mt-4">
            1. Ứng dụng trong công nghiệp thực phẩm
          </h3>
          <p>
            Nấm men, đặc biệt là <em>Saccharomyces cerevisiae</em>, có khả năng
            lên men carbohydrate thành ethanol và CO₂. Trong sản xuất bánh mì,
            nấm men giúp tạo bọt khí làm bánh nở và mềm xốp. Trong chế biến nông
            sản và thức ăn chăn nuôi, nấm men giúp lên men, nâng cao giá trị
            dinh dưỡng và khả năng tiêu hóa.
          </p>
          <div className="text-center my-6">
            <img
              src={banhmi}
              alt=""
              className="inline-block max-w-full md:max-w-xl rounded shadow"
            />
          </div>

          <h3 className="text-lg font-medium mt-4">
            2. Ứng dụng trong sản xuất bia
          </h3>
          <p>
            Ngành bia sử dụng các chủng men như <em>S. cerevisiae</em> và{" "}
            <em>S. uvarum</em> để lên men nổi và chìm, tạo nên các loại bia khác
            nhau. Nấm men không chỉ tạo ethanol và CO₂ mà còn sinh các chất tạo
            hương đặc trưng.
          </p>
          <div className="text-center my-6">
            <img
              src={bia}
              alt="Quy trình lên men bia"
              className="inline-block max-w-full md:max-w-xl rounded shadow"
            />
          </div>

          <h3 className="text-lg font-medium mt-4">
            3. Ứng dụng trong hỗ trợ sức khỏe
          </h3>
          <p>
            Nấm men được dùng làm thực phẩm bổ sung và men vi sinh. Men dinh
            dưỡng chứa vitamin B, protein, selen và crôm, giúp cải thiện tiêu
            hóa, tăng miễn dịch, và hỗ trợ kiểm soát đường huyết.{" "}
            <em>S. boulardii</em> là men vi sinh phổ biến giúp điều trị tiêu
            chảy.
          </p>

          <h3 className="text-lg font-medium mt-4">
            4. Ứng dụng chiết xuất Beta-Glucan trong y học
          </h3>
          <p>
            Beta-Glucan là polysaccharide có trong thành tế bào nấm men, đặc
            biệt là Beta-1,3/1,6-D-glucan từ <em>S. cerevisiae</em>. Nó kích
            hoạt miễn dịch tự nhiên, hỗ trợ điều trị ung thư, viêm nhiễm. Việt
            Nam đã chiết xuất thành công hoạt chất này với độ tinh sạch trên
            80%.
          </p>

          <h3 className="text-lg font-medium mt-4">5. Một số ứng dụng khác</h3>
          <ul className="list-disc pl-6">
            <li>
              Sản xuất thực phẩm: nước tương, phô mai, sake, xúc xích, sữa chua…
            </li>
            <li>
              Sản xuất kháng sinh như penicillin, lovastatin, cyclosporine.
            </li>
            <li>Nghiên cứu tế bào và gen: chu trình tế bào, tái tổ hợp DNA.</li>
            <li>Phụ gia khử độc tố nấm mốc trong thức ăn chăn nuôi.</li>
          </ul>
        </section>
      </div>
    </DashbroardLayout>
  );
};

export default Blog;
