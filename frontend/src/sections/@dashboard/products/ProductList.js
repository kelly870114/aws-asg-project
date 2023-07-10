import PropTypes from 'prop-types';
// @mui
import { Grid, Box, Card, Link, Typography, Stack } from '@mui/material';
import Label from '../../../components/label';
import { ColorPreview } from '../../../components/color-utils';

import ShopProductCard from './ProductCard';

// ----------------------------------------------------------------------

ProductList.propTypes = {
  products: PropTypes.array.isRequired,
};

export default function ProductList({ products, ...other }) {
  return (
    <Grid container spacing={3} {...other}>
      {products.map((product) => (
        <Grid key={product.id} item xs={12} sm={6} md={3}>

          <ShopProductCard product={product} />
        </Grid>
      ))}
    </Grid>
    
  );
}
