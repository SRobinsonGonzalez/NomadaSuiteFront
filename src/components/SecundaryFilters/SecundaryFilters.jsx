import { InputNumber, Space, Form, Select, Flex } from 'antd';
import SecundaryFiltersStyles from './SecundaryFilters.module.css';
import { useDispatch } from 'react-redux';
import { orderByRating } from '../../redux/Actions/actions';
import { useState } from 'react';

const SecundaryFilters = ({ handleSecValues, show }) => {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    min: 0,
    max: null
  });

  const onChangeMin = (value) => {
    setValues({
      ...values,
      min: value
    });
    handleSecValues({
      ...values,
      min: value
    })
  };
  const onChangeMax = (value) => {
    setValues({
      ...values,
      max: value
    });
    handleSecValues({
      ...values,
      max: value
    })
  };
  const handleChange = (value) => {
    /* dispatch(orderByRating(value)); */
    setValues({
      ...values,
      orderByRating: value
    });
    handleSecValues({
      ...values,
      orderByRating: value
    })
  };

  return (
    <div className={`${SecundaryFiltersStyles.secundaryFilters} ${show ? SecundaryFiltersStyles.show : ""}`}>
      <Form>
        <Flex justify={"center"}>
          <Form.Item label={"Rango de precio"} style={{ margin: '0' }}>
            <Space>
              <InputNumber
                formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                min={0}
                onChange={onChangeMin}
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                step="0.01"
              />
              <InputNumber
                formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                onChange={onChangeMax}
                min={0}
                step="0.01"
              />
            </Space>
          </Form.Item>
          <Form.Item label={"Rating"} style={{ margin: '0 0 0 25px' }}>
            <Select
              style={{ width: "120px" }}
              placeholder="Orden"
              onChange={handleChange}
              options={[{ value: "min-max", label: "Ascendente" }, { value: "max-min", label: "Descendente" }]}
            />
          </Form.Item>
        </Flex>
      </Form>
    </div>
  )
}

export default SecundaryFilters;