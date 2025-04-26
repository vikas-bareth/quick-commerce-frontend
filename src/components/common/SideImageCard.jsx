import React from "react";

const SideImageCard = ({
  card_title,
  card_description,
  card_image_url,
  children,
}) => {
  return (
    <div>
      <div className="card card-side bg-base-100 shadow-sm ">
        <figure>
          <img src={card_image_url} alt="Card Side Image" />
        </figure>

        <div className="card-body">
          <h2 className="card-title">{card_title}</h2>
          <p>{card_description}</p>
          <div className="min-w-64">
            {children && <div className="mt-4">{children}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideImageCard;
