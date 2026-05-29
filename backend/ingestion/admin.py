from django.contrib import admin
from .models import Company, DataSource, EmissionRecord
import csv


@admin.register(DataSource)
class DataSourceAdmin(admin.ModelAdmin):

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)

        file_path = obj.file.path

        with open(file_path, newline='') as csvfile:
            reader = csv.DictReader(csvfile)

            for row in reader:

                # SAP parser
                if obj.source_type == 'SAP':
                    EmissionRecord.objects.get_or_create(
                        data_source=obj,
                        plant=row['Plant'],
                        fuel=row['Fuel'],
                        quantity=float(row['Qty']),
                        unit=row['Unit'],
                        defaults={
                            'scope': 'SCOPE1'
                        }
                    )

                # Utility parser
                elif obj.source_type == 'UTILITY':
                    EmissionRecord.objects.get_or_create(
                        data_source=obj,
                        plant=row['MeterID'],
                        fuel='Electricity',
                        quantity=float(row['Electricity_kWh']),
                        unit='kWh',
                        defaults={
                            'scope': 'SCOPE2'
                        }
                    )

                # Travel parser
                elif obj.source_type == 'TRAVEL':
                    EmissionRecord.objects.get_or_create(
                        data_source=obj,
                        plant=row['TripID'],
                        fuel=row['Mode'],
                        quantity=float(row['Distance_km']),
                        unit='km',
                        defaults={
                            'scope': 'SCOPE3'
                        }
                    )


admin.site.register(EmissionRecord)
admin.site.register(Company)