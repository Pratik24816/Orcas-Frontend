import React, { useEffect } from "react";
import Shepherd from "shepherd.js";
import "shepherd.js/dist/css/shepherd.css";

export default function Tour({ steps = [], open = false, onClose = () => {} }) {
  useEffect(() => {
    if (!open) return;

    const tour = new Shepherd.Tour({
      defaultStepOptions: {
        classes: "shepherd-theme-arrows",
        scrollTo: { behavior: "smooth", block: "center" },
        cancelIcon: { enabled: true },
      },
      useModalOverlay: true,
    });

    steps.forEach((s) => {
      const step = {
        id: s.id,
        text: s.text,
        attachTo: s.attachTo,
        buttons: s.buttons,
        classes: s.classes,
        when: s.when,
      };
      tour.addStep(step);
    });

    const handleClose = () => {
      try { tour.hide(); } catch (e) {}
      onClose && onClose();
    };

    tour.on("complete", handleClose);
    tour.on("cancel", handleClose);
    tour.start();

    return () => {
      try {
        tour.off("complete", handleClose);
        tour.off("cancel", handleClose);
        tour.destroy();
      } catch (e) {}
    };
  }, [open, steps, onClose]);

  return null;
}

