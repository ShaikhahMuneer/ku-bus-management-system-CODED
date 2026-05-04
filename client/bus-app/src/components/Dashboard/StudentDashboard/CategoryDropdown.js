import React, { useState } from "react";
import { Bus, Home, Building2, ChevronDown } from "lucide-react";

const categories = [
  {
    id: "beeyout",
    title: "Beeyout",
    subtitle: "Female Only - Paid",
    icon: <Home size={18} />,
  },
  {
    id: "campus-off",
    title: "Campus-Off",
    subtitle: "Mixed - Free",
    icon: <Bus size={18} />,
  },
  {
    id: "college",
    title: "College",
    subtitle: "Mixed - Free",
    icon: <Building2 size={18} />,
  },
];

function CategoryDropdown({ selectedCategory, setSelectedCategory }) {
  const [open, setOpen] = useState(false);

  const selected =
    categories.find((c) => c.id === selectedCategory) || categories[0];

  return (
    <div className="category-dropdown">
      <div className="selected-category" onClick={() => setOpen(!open)}>
        <div className="left">
          <div className={`icon-box ${selected.id}`}>{selected.icon}</div>
          <div>
            <h4>{selected.title}</h4>
            <p>{selected.subtitle}</p>
          </div>
        </div>

        <ChevronDown
          size={18}
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "0.3s",
          }}
        />
      </div>

      {open && (
        <div className="dropdown-options">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className={`dropdown-option ${
                selectedCategory === cat.id ? "option-active" : ""
              }`}
              onClick={() => {
                setSelectedCategory(cat.id);
                setOpen(false);
              }}
            >
              <div className={`icon-box ${cat.id}`}>{cat.icon}</div>

              <div>
                <h4>{cat.title}</h4>
                <p>{cat.subtitle}</p>
              </div>

              {selectedCategory === cat.id && <div className="active-dot" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoryDropdown;
