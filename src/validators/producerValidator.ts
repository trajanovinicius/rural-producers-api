import * as yup from "yup";
import { cpf, cnpj } from "cpf-cnpj-validator";

export const producerSchema = yup.object().shape({
  document: yup
    .string()
    .required("CPF ou CNPJ é obrigatório")
    .test(
      "valid-document",
      "CPF ou CNPJ inválido",
      (value) => cpf.isValid(value) || cnpj.isValid(value)
    ),
  name: yup.string().required("Nome é obrigatório"),
  farms: yup.array().of(
    yup
      .object()
      .shape({
        name: yup.string().required("Nome da fazenda é obrigatório"),
        city: yup.string().required("Cidade é obrigatória"),
        state: yup.string().required("Estado é obrigatório"),
        totalArea: yup.number().required("Área total é obrigatória").positive(),
        arableArea: yup
          .number()
          .required("Área agricultável é obrigatória")
          .positive(),
        vegetationArea: yup
          .number()
          .required("Área de vegetação é obrigatória")
          .positive(),
        crops: yup.array().of(
          yup.object().shape({
            name: yup.string().required("Nome da cultura é obrigatório"),
            harvest: yup.string().required("Safra é obrigatória"),
          })
        ),
      })
      .test(
        "area-validation",
        "Soma das áreas excede a área total",
        (value) => {
          return value.arableArea + value.vegetationArea <= value.totalArea;
        }
      )
  ),
});
